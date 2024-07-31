# CSARCH2 Cache Simulation Project

This project provides a cache simulator that utilizes a Block-Set Associative (BSA) cache memory mapping function and a Least Recently Used (LRU) replacement algorithm.

## How to Access

Visit the [Cache Simulation Website](https://ashoolotl.github.io/CSARCH2-SIMULATION-PROJECT/) to use the simulator.

## How to Use

Input the following parameters:

1. **Block Size** (words)
2. **Set Size** (blocks)
3. **Main Memory Size** (blocks/words)
4. **Cache Size** (blocks/words)
5. **Program Flow** (words)
   - Input the program flow as a list of blocks/words, separated by commas.
   - Example: `0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15`

*Note: The cache access time is a constant of 1ns, and the memory access time is a constant of 10ns.*

## Expected Output

1. **Cache Hits**
2. **Cache Misses**
3. **Miss Penalty** (ns)
4. **Average Memory Access Time** (ns)
5. **Total Memory Access Time** (ns)
6. **Cache Memory Snapshot**
7. **Cache Memory Table**
