#!/usr/bin/env node

/**
 * Script to analyze usage of preact/* exports in external repositories
 * Usage: node analyze_usage.js <repo_path_1> <repo_path_2> ...
 */

const fs = require('fs');
const path = require('path');

// Load the exports inventory
const exportsInventory = {
  "preact/autocomplete": ["AutocompleteElement", "AutocompleteElementProps", "AutocompletePageProvider", "HistoryElement", "SearchInput"],
  "preact/category": ["CategoryPageProvider"],
  "preact/common": ["ExtendedStore", "InfiniteScroll", "InfiniteScrollProps", "InfiniteScrollWithLink", "State", "Store", "StoreContext", "createExtendableStore", "createStore", "defaultState"],
  "preact/events": ["dispatchNostoEvent", "subscribeToNostoEvent", "useEventBusDispatch", "useEventBusSubscribe"],
  "preact/hooks": ["Page", "SpeechToText", "UseFacetOptions", "speechToTextSupported", "useActions", "useDecoratedSearchResults", "useFacet", "useFacets", "useLoadMore", "useNostoAppState", "usePagination", "usePersonalization", "useProductFilters", "useRange", "useRangeSelector", "useResponse", "useSelectedFiltersCount", "useSizeOptions", "useSort", "useSpeechToText", "useSwatches"],
  "preact/inject": ["* (re-export all)", "AutocompleteContext", "AutocompleteInjectContext", "createUserComponentRenderer"],
  "preact/legacy": ["InfiniteScrollWithObserver", "getNextPageQuery", "intersectionObserverSupported", "newSearch", "updateSearch"],
  "preact/serp": ["SearchPageProvider", "SerpElement"]
};

function findFilesRecursively(dir, extensions = ['.ts', '.tsx', '.js', '.jsx']) {
  const files = [];
  
  if (!fs.existsSync(dir)) {
    return files;
  }
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      files.push(...findFilesRecursively(fullPath, extensions));
    } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function analyzeImports(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const imports = [];
  
  // Match various import patterns for @nosto/search-js/preact
  const patterns = [
    // import { name } from "@nosto/search-js/preact/module"
    /import\s*{\s*([^}]+)\s*}\s*from\s*['""]@nosto\/search-js\/preact\/([^'""]+)['"]/g,
    // import name from "@nosto/search-js/preact/module"
    /import\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s+from\s*['""]@nosto\/search-js\/preact\/([^'""]+)['"]/g,
    // import * as name from "@nosto/search-js/preact/module"
    /import\s*\*\s*as\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s+from\s*['""]@nosto\/search-js\/preact\/([^'""]+)['"]/g
  ];
  
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      if (pattern.source.includes('{')) {
        // Named imports
        const namedImports = match[1]
          .split(',')
          .map(imp => imp.trim().replace(/^type\s+/, ''))
          .filter(imp => imp.length > 0);
        
        for (const namedImport of namedImports) {
          imports.push({
            type: 'named',
            name: namedImport.trim(),
            module: `preact/${match[2]}`,
            file: filePath
          });
        }
      } else if (pattern.source.includes('\\*')) {
        // Namespace import
        imports.push({
          type: 'namespace',
          name: match[1],
          module: `preact/${match[2]}`,
          file: filePath
        });
      } else {
        // Default import
        imports.push({
          type: 'default',
          name: match[1],
          module: `preact/${match[2]}`,
          file: filePath
        });
      }
    }
  }
  
  return imports;
}

function analyzeRepository(repoPath) {
  console.log(`\n=== Analyzing repository: ${repoPath} ===`);
  
  const files = findFilesRecursively(repoPath);
  console.log(`Found ${files.length} source files`);
  
  const allImports = [];
  
  for (const file of files) {
    const imports = analyzeImports(file);
    allImports.push(...imports);
  }
  
  console.log(`Found ${allImports.length} preact/* imports`);
  
  return allImports;
}

function generateReport(allImports) {
  console.log('\n=== USAGE ANALYSIS REPORT ===\n');
  
  const usedExports = new Set();
  const unusedExports = new Set();
  const usageByModule = {};
  
  // Track all imports
  for (const imp of allImports) {
    if (imp.type === 'named') {
      usedExports.add(`${imp.module}:${imp.name}`);
    } else if (imp.type === 'namespace') {
      // Namespace imports mean all exports from that module are potentially used
      if (exportsInventory[imp.module]) {
        for (const exp of exportsInventory[imp.module]) {
          usedExports.add(`${imp.module}:${exp}`);
        }
      }
    }
    
    if (!usageByModule[imp.module]) {
      usageByModule[imp.module] = [];
    }
    usageByModule[imp.module].push(imp);
  }
  
  // Determine unused exports
  for (const [module, exports] of Object.entries(exportsInventory)) {
    for (const exp of exports) {
      const key = `${module}:${exp}`;
      if (!usedExports.has(key)) {
        unusedExports.add(key);
      }
    }
  }
  
  // Generate report
  console.log('## Used Exports by Module\n');
  for (const [module, imports] of Object.entries(usageByModule)) {
    console.log(`### ${module}`);
    const uniqueImports = [...new Set(imports.map(imp => imp.name))];
    for (const imp of uniqueImports) {
      console.log(`  ✓ ${imp}`);
    }
    console.log('');
  }
  
  console.log('## Unused Exports\n');
  const unusedByModule = {};
  for (const unused of unusedExports) {
    const [module, exportName] = unused.split(':');
    if (!unusedByModule[module]) {
      unusedByModule[module] = [];
    }
    unusedByModule[module].push(exportName);
  }
  
  for (const [module, exports] of Object.entries(unusedByModule)) {
    console.log(`### ${module}`);
    for (const exp of exports) {
      console.log(`  ✗ ${exp}`);
    }
    console.log('');
  }
  
  console.log('## Summary\n');
  console.log(`Total exports: ${Object.values(exportsInventory).flat().length}`);
  console.log(`Used exports: ${usedExports.size}`);
  console.log(`Unused exports: ${unusedExports.size}`);
  console.log(`Usage rate: ${Math.round((usedExports.size / Object.values(exportsInventory).flat().length) * 100)}%`);
  
  return {
    used: Array.from(usedExports),
    unused: Array.from(unusedExports),
    usageByModule,
    summary: {
      total: Object.values(exportsInventory).flat().length,
      used: usedExports.size,
      unused: unusedExports.size,
      usageRate: Math.round((usedExports.size / Object.values(exportsInventory).flat().length) * 100)
    }
  };
}

// Main execution
if (require.main === module) {
  const repoPaths = process.argv.slice(2);
  
  if (repoPaths.length === 0) {
    console.log('Usage: node analyze_usage.js <repo_path_1> <repo_path_2> ...');
    console.log('');
    console.log('Example:');
    console.log('  node analyze_usage.js /path/to/search-templates /path/to/search-templates-starter');
    process.exit(1);
  }
  
  const allImports = [];
  
  for (const repoPath of repoPaths) {
    const imports = analyzeRepository(repoPath);
    allImports.push(...imports);
  }
  
  const report = generateReport(allImports);
  
  // Save detailed report
  const reportPath = '/tmp/preact_usage_report.json';
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\nDetailed report saved to: ${reportPath}`);
}

module.exports = { analyzeRepository, generateReport };