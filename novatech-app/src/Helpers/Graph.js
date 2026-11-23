export class Graph {
  constructor() {
    this.adjacencyList = new Map();
  }

  addVertex(vertex) {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, []);
    }
  }

  addEdge(v1, v2, weight) {
    this.addVertex(v1);
    this.addVertex(v2);
    this.adjacencyList.get(v1).push({ node: v2, weight });
    this.adjacencyList.get(v2).push({ node: v1, weight });
  }

  shortestPath(start, end) {
    const distances = {};
    const previous = {};
    const visited = new Set();
    const nodes = Array.from(this.adjacencyList.keys());

    for (const vertex of nodes) {
      distances[vertex] = Infinity;
      previous[vertex] = null;
    }
    distances[start] = 0;

    while (visited.size < nodes.length) {
      let current = null;
      let minDistance = Infinity;

      for (const vertex of nodes) {
        if (!visited.has(vertex) && distances[vertex] < minDistance) {
          minDistance = distances[vertex];
          current = vertex;
        }
      }

      if (current === null || current === end) break;
      visited.add(current);

      for (const neighbor of this.adjacencyList.get(current)) {
        const candidate = distances[current] + neighbor.weight;
        if (candidate < distances[neighbor.node]) {
          distances[neighbor.node] = candidate;
          previous[neighbor.node] = current;
        }
      }
    }

    const path = [];
    let step = end;
    while (step) {
      path.unshift(step);
      step = previous[step];
    }

    const totalKm = distances[end] === Infinity ? 0 : distances[end];
    return {
      path,
      distanceKm: totalKm,
      estimatedMinutes: totalKm * 3
    };
  }
}