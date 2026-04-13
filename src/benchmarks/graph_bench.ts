const numNodes = 10000;
const iterations = 1000;

interface Node {
    id: string;
    fx: number | null;
    fy: number | null;
}

const nodes: Node[] = Array.from({ length: numNodes }, (_, i) => ({
    id: `node_${i}`,
    fx: 100,
    fy: 100,
}));

function benchmarkIterative() {
    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
        nodes.forEach(n => {
            n.fx = null;
            n.fy = null;
        });
        // Reset for next iteration to keep it "fair" (though clearing is fast)
        for (let j = 0; j < numNodes; j++) {
            nodes[j].fx = 100;
            nodes[j].fy = 100;
        }
    }
    const end = performance.now();
    return end - start;
}

function benchmarkDirect() {
    const start = performance.now();
    const targetNode = nodes[numNodes / 2];
    for (let i = 0; i < iterations; i++) {
        targetNode.fx = null;
        targetNode.fy = null;
        // Reset
        targetNode.fx = 100;
        targetNode.fy = 100;
    }
    const end = performance.now();
    return end - start;
}

// Warmup
benchmarkIterative();
benchmarkDirect();

const iterativeTime = benchmarkIterative();
const directTime = benchmarkDirect();

console.log(`--- Benchmark Results ---`);
console.log(`Number of nodes: ${numNodes}`);
console.log(`Iterations: ${iterations}`);
console.log(`Iterative (forEach): ${iterativeTime.toFixed(4)}ms`);
console.log(`Direct (target node): ${directTime.toFixed(4)}ms`);
if (directTime > 0) {
    console.log(`Improvement: ${(iterativeTime / directTime).toFixed(2)}x faster`);
} else {
    console.log(`Direct access was too fast to measure accurately.`);
}
