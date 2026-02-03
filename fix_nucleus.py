import sys

with open('src/components/SemanticGraph.tsx', 'r') as f:
    content = f.read()

old_block = """        <div style={{ width: 120, height: 120 }}>
<div style={{ width: 120, height: 120, pointerEvents: "auto", cursor: "pointer" }} onClick={() => handleNodeClick({ id: "nucleus", label: "", type: "nucleus", mass: 150, group: 0 })}>
                <ambientLight intensity={0.5} />"""

new_block = """        <div
          style={{ width: 120, height: 120, pointerEvents: 'auto', cursor: 'pointer' }}
          onClick={() => handleNodeClick({ id: 'nucleus', label: '', type: 'nucleus', mass: 150, group: 0 })}
        >
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={0.5} />"""

content = content.replace(old_block, new_block)

with open('src/components/SemanticGraph.tsx', 'w') as f:
    f.write(content)
