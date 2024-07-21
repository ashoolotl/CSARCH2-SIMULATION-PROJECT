function simulateCache() {
    const blockSize = parseInt(document.getElementById("blockSize").value);
    const setSize = parseInt(document.getElementById("setSize").value);
    const memorySize = document.getElementById("memorySize").value.split('/').map(Number);
    const cacheSize = document.getElementById("cacheSize").value.split('/').map(Number);
    const programFlow = document.getElementById("programFlow").value.split(',').map(Number);

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

    const missRate = misses / programFlow.length;
    const hitRate = hits / programFlow.length;
    const missPenalty = cacheAccessTime + (blockSize * memoryAccessTime) + cacheAccessTime;
    const averageAccessTime = (hitRate * cacheAccessTime) + (missRate * missPenalty);
    const totalAccessTime = (hits * blockSize * cacheAccessTime) + (misses * blockSize * (memoryAccessTime + cacheAccessTime)) + (misses * cacheAccessTime);

    const result = `
        <p>Number of Cache Hits: ${hits}</p>
        <p>Number of Cache Misses: ${misses}</p>
        <p>Miss Penalty: ${missPenalty} ns</p>
        <p>Average Memory Access Time: ${averageAccessTime.toFixed(2)} ns</p>
        <p>Total Memory Access Time: ${totalAccessTime} ns</p>
        <h3>Cache Memory Snapshot:</h3>
        <pre>${JSON.stringify(cache, null, 2)}</pre>
    `;
    document.getElementById("result").innerHTML = result;
}
