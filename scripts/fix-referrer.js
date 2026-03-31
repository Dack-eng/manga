const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            if (!file.includes('node_modules') && !file.includes('.next') && !file.includes('.git')) {
                results = results.concat(walk(file));
            }
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('.');
let fixedFiles = 0;
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('referrerPolicy="no-referrer"')) {
        content = content.replace(/referrerPolicy="no-referrer"/g, 'referrerPolicy="no-referrer"');
        fs.writeFileSync(file, content);
        console.log('Fixed', file);
        fixedFiles++;
    }
    // Also fix any image lacking referrer policy at all (like ReaderClient.tsx)
    // Actually, maybe I can just inject it there specifically, but for now I'll use multi_replace.
});
console.log('Total fixed:', fixedFiles);
