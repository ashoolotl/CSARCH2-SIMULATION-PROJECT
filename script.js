
//Cache Simulator, Block Set Associative (LRU)

// Input: 
// 1. Block size
// 2. Set size
// 3. MM memory size (blocks/words)
// 4. Cache memory size (blocks/words)
// 5. Program flow to be simulated (blocks/words)
// 6. ...and other parameters deemed needed.
// Output: 
// 1. Number of cache hits
// 2. Number of cache miss
// 3. Miss penalty
// 4. Average memory access time
// 5. Total memory access time
// 6. Snapshot of the cache memory
// 7. With option to output result in text file.

function simulateCache() {
    const blockSize = parseInt(document.getElementById("blockSize").value);
    const setSize = parseInt(document.getElementById("setSize").value);
    let memorySize = document.getElementById("memorySize").value.split('/').map(Number);
    let cacheSize = document.getElementById("cacheSize").value.split('/').map(Number);
    const programFlow = document.getElementById("programFlow").value.split(',').map(Number);
    document.getElementById("exportButton").style.display = "block";

    
    const memoryUnit = document.querySelector('input[name="memoryUnit"]:checked').value;
    const cacheUnit = document.querySelector('input[name="cacheUnit"]:checked').value;
    
    //Block to Word input conversion
    if (memoryUnit === "blocks") {
        memorySize = memorySize.map(size => size * blockSize);
    }

    //Word to Block input conversion
    if (cacheUnit === "words") {
        cacheSize = cacheSize.map(size => size / blockSize);
    }

    const cacheAccessTime = 1;
    const memoryAccessTime = 10; 

    const numSets = Math.ceil(cacheSize[0] / setSize);
    let cache = new Array(numSets).fill(null).map(() => new Array(setSize).fill({ block: -1, lastUsed: 0 }));

    let hits = 0, misses = 0, time = 0;

    programFlow.forEach((block, index) => {
        const setIndex = block % numSets;
        let set = cache[setIndex];
        let hit = false;

        for (let i = 0; i < setSize; i++) {
            if (set[i].block === block) {
                hits++;
                hit = true;
                set[i].lastUsed = index;
                break;
            }
        }

        if (!hit) {
            misses++;
            let lruIndex = 0;
            for (let i = 1; i < setSize; i++) {
                if (set[i].lastUsed < set[lruIndex].lastUsed) {
                    lruIndex = i;
                }
            }
            set[lruIndex] = { block: block, lastUsed: index };
            time += cacheAccessTime + memoryAccessTime;
        } else {
            time += cacheAccessTime;
        }
    });

    const missRate = misses / memorySize;
    const hitRate = hits / memorySize;
    const missPenalty = cacheAccessTime + (blockSize * memoryAccessTime) + cacheAccessTime;
    const averageAccessTime = (hitRate * cacheAccessTime) + (missRate * missPenalty);
    const totalAccessTime = (hits * blockSize * cacheAccessTime) + (misses * blockSize * (memoryAccessTime + cacheAccessTime)) + (misses * cacheAccessTime);

    let table = '<table border="1"><tr><th>Set</th>';
    for (let i = 0; i < setSize; i++) {
        table += `<th>Block ${i}</th>`;
    }
    table += '</tr>';

    cache.forEach((set, setIndex) => {
        table += `<tr><td>Set ${setIndex}</td>`;
        set.sort((a, b) => b.lastUsed - a.lastUsed); //LRU (last recently used, descending)
        set.forEach(block => {
            table += `<td>${block.block !== -1 ? block.block : '-'}</td>`;
        });
        table += '</tr>';
    });
    table += '</table>';

    const result = `
        <p>Number of Cache Hits: ${hits}/${memorySize}</p>
        <p>Number of Cache Misses: ${misses}/${memorySize}</p>
        <p>Miss Penalty: ${missPenalty} ns</p>
        <p>Average Memory Access Time: ${averageAccessTime.toFixed(2)} ns</p>
        <p>Total Memory Access Time: ${totalAccessTime} ns</p>
        <h3>Cache Memory Snapshot:</h3>
        <pre>${JSON.stringify(cache, null, 2)}</pre>
        <h3>Cache Memory Table:</h3>
        ${table}
    `;
    document.getElementById("result").innerHTML = result;
}

function exportResult() {
    const table = document.querySelector("table");
    let tableData = "";
    for (let row of table.rows) {
        for (let cell of row.cells) {
            tableData += cell.innerText + "\t";
        }
        tableData += "\n";
    }

    const blob = new Blob([tableData], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Cache-Memory-Snapshot.txt";
    link.click();
}