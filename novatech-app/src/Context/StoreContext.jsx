import { createContext, useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '../Helpers/supabaseClient';
import { Stack } from '../Helpers/Stack';
import { Queue } from '../Helpers/Queue';
import { NAryTree } from '../Helpers/NAryTree';
import { Trie } from '../Helpers/Trie';
import { Graph } from '../Helpers/Graph';

export const StoreContext = createContext();

const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    code: 'MBP-14',
    name: 'MacBook Pro 14 M3',
    specs: 'Chip M3 Pro, 18GB RAM, 512GB SSD NVMe',
    price: 1599,
    score: 95,
    categoryId: 'ultrabooks'
  },
  {
    id: 'prod-2',
    code: 'KEY-Q1',
    name: 'Teclado Keychron Q1 Pro',
    specs: 'Aluminio CNC, Switches Brown, QMK/VIA',
    price: 189,
    score: 92,
    categoryId: 'keyboards'
  },
  {
    id: 'prod-3',
    code: 'WH-XM5',
    name: 'Sony WH-1000XM5',
    specs: 'Cancelacion activa de ruido, Audio LDAC',
    price: 299,
    score: 88,
    categoryId: 'audio'
  },
  {
    id: 'prod-4',
    code: 'WS-RTX',
    name: 'Workstation Ryzen 9 RTX',
    specs: 'Ryzen 9 7950X, 64GB DDR5, RTX 4080',
    price: 2450,
    score: 90,
    categoryId: 'workstations'
  }
];

export function StoreProvider({ children }) {
  const [products] = useState(INITIAL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [recentViews, setRecentViews] = useState(['MacBook Pro 14 M3', 'Sony WH-1000XM5']);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([
    { id: 'init-1', sender: 'Operador', content: 'Canal de soporte en linea conectado.' }
  ]);

  const recentStackRef = useRef(new Stack(5));
  const cartUndoStackRef = useRef(new Stack(30));
  const orderQueueRef = useRef(new Queue());

  useEffect(() => {
    recentStackRef.current.push('Sony WH-1000XM5');
    recentStackRef.current.push('MacBook Pro 14 M3');
  }, []);

  const categoryTree = useMemo(() => {
    const tree = new NAryTree('all', 'Todo el catalogo');
    tree.insert('all', 'laptops', 'Laptops');
    tree.insert('laptops', 'ultrabooks', 'Ultrabooks');
    tree.insert('laptops', 'workstations', 'Workstations');
    tree.insert('all', 'peripherals', 'Perifericos');
    tree.insert('peripherals', 'keyboards', 'Teclados');
    tree.insert('peripherals', 'audio', 'Audio Hi-Res');
    return tree;
  }, []);

  const categoriesList = useMemo(() => categoryTree.flatten(), [categoryTree]);

  const productTrie = useMemo(() => {
    const trie = new Trie();
    products.forEach((product) => {
      trie.insert(product.name, product);
      product.name.split(' ').forEach((token) => {
        if (token.length > 2) {
          trie.insert(token, product);
        }
      });
    });
    return trie;
  }, [products]);

  const deliveryGraph = useMemo(() => {
    const graph = new Graph();
    graph.addEdge('Bodega Central', 'Nodo Norte', 5);
    graph.addEdge('Bodega Central', 'Nodo Centro', 3);
    graph.addEdge('Bodega Central', 'Nodo Sur', 4);
    graph.addEdge('Nodo Centro', 'Nodo Sur', 2);
    graph.addEdge('Nodo Centro', 'Nodo Norte', 4);
    return graph;
  }, []);

  const filteredProducts = useMemo(() => {
    let list = products;

    if (searchQuery.trim() !== '') {
      const matches = productTrie.searchPrefix(searchQuery);
      const uniqueMap = new Map();
      matches.forEach((item) => uniqueMap.set(item.id, item));
      list = Array.from(uniqueMap.values());
    }

    if (selectedCategory !== 'all') {
      const node = categoryTree.findNode(selectedCategory);
      const validIds = new Set([selectedCategory]);
      if (node && node.children.length > 0) {
        node.children.forEach((child) => validIds.add(child.id));
      }
      list = list.filter((p) => validIds.has(p.categoryId));
    }

    return list;
  }, [products, searchQuery, selectedCategory, productTrie, categoryTree]);

  useEffect(() => {
    const fetchInitialData = async () => {
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: true });

      if (ordersData) {
        orderQueueRef.current = new Queue(ordersData);
        setOrders(orderQueueRef.current.toArray());
      }

      const { data: messagesData } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (messagesData && messagesData.length > 0) {
        setMessages(messagesData);
      }
    };

    fetchInitialData();

    const ordersChannel = supabase
      .channel('orders-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: true })
          .then(({ data }) => {
            if (data) {
              orderQueueRef.current = new Queue(data);
              setOrders(orderQueueRef.current.toArray());
            }
          });
      })
      .subscribe();

    const messagesChannel = supabase
      .channel('messages-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        setMessages((prev) => {
          if (prev.some((m) => m.id === payload.new.id)) return prev;
          return [...prev, payload.new];
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(messagesChannel);
    };
  }, []);

  const inspectProduct = (productName) => {
    recentStackRef.current.push(productName);
    setRecentViews(recentStackRef.current.toArrayReversed());
  };

  const addToCart = (product) => {
    cartUndoStackRef.current.push(product.id);
    setCart((prev) => [...prev, product]);
  };

  const undoLastCartItem = () => {
    const lastId = cartUndoStackRef.current.pop();
    if (!lastId) return;
    setCart((prev) => {
      const index = prev.findLastIndex((item) => item.id === lastId);
      if (index === -1) return prev;
      const copy = [...prev];
      copy.splice(index, 1);
      return copy;
    });
  };

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.price), 0),
    [cart]
  );

  const calculateRoute = (destinationNode) => {
    return deliveryGraph.shortestPath('Bodega Central', destinationNode || 'Nodo Sur');
  };

  const submitOrder = async (customerName, destinationNode) => {
    if (cart.length === 0) return null;
    const orderCode = `ORD-${Math.floor(100 + Math.random() * 900)}`;
    const newOrder = {
      order_code: orderCode,
      customer_name: customerName || 'Cliente NovaTech',
      destination_node: destinationNode || 'Nodo Sur',
      total: cartTotal,
      status: 'En espera'
    };

    const { data, error } = await supabase.from('orders').insert([newOrder]).select();
    if (error) throw error;

    if (data && data[0]) {
      orderQueueRef.current.enqueue(data[0]);
      setOrders(orderQueueRef.current.toArray());
    }

    setCart([]);
    cartUndoStackRef.current = new Stack(30);
    return orderCode;
  };

  const dispatchNextOrder = async () => {
    const frontOrder = orderQueueRef.current.dequeue();
    if (!frontOrder) return null;

    setOrders(orderQueueRef.current.toArray());
    await supabase.from('orders').delete().eq('id', frontOrder.id);
    return frontOrder;
  };

  const sendRealtimeMessage = async (sender, content) => {
    if (!content.trim()) return;
    const { data, error } = await supabase
      .from('messages')
      .insert([{ sender, content: content.trim() }])
      .select();

    if (error) throw error;

    if (data && data[0]) {
      setMessages((prev) => {
        if (prev.some((m) => m.id === data[0].id)) return prev;
        return [...prev, data[0]];
      });
    }
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        filteredProducts,
        categoriesList,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        recentViews,
        inspectProduct,
        cart,
        cartTotal,
        addToCart,
        undoLastCartItem,
        calculateRoute,
        orders,
        submitOrder,
        dispatchNextOrder,
        messages,
        sendRealtimeMessage
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}