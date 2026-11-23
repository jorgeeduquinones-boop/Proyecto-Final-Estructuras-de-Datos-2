export class Stack {
  constructor(maxSize = 20) {
    this.items = [];
    this.maxSize = maxSize;
  }

  push(element) {
    if (this.items.length >= this.maxSize) {
      this.items.shift();
    }
    this.items.push(element);
  }

  pop() {
    if (this.isEmpty()) return null;
    return this.items.pop();
  }

  peek() {
    if (this.isEmpty()) return null;
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }

  toArrayReversed() {
    return [...this.items].reverse();
  }

  toArray() {
    return [...this.items];
  }
}