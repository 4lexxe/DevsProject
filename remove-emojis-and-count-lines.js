const fs = require('fs');
const path = require('path');

// Patrón regex completo para detectar emojis (incluye todos los rangos Unicode de emojis)
// Captura emojis simples, variantes, y secuencias comunes
const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FA6F}]|[\u{1FA70}-\u{1FAFF}]|[\u{203C}]|[\u{2049}]|[\u{2122}]|[\u{2139}]|[\u{2194}-\u{2199}]|[\u{21A9}-\u{21AA}]|[\u{231A}-\u{231B}]|[\u{2328}]|[\u{2388}]|[\u{23CF}]|[\u{23E9}-\u{23F3}]|[\u{23F8}-\u{23FA}]|[\u{24C2}]|[\u{25AA}-\u{25AB}]|[\u{25B6}]|[\u{25C0}]|[\u{25FB}-\u{25FE}]|[\u{2600}-\u{2604}]|[\u{260E}]|[\u{2611}]|[\u{2614}-\u{2615}]|[\u{2618}]|[\u{261D}]|[\u{2620}]|[\u{2622}-\u{2623}]|[\u{2626}]|[\u{262A}]|[\u{262E}-\u{262F}]|[\u{2638}-\u{263A}]|[\u{2640}]|[\u{2642}]|[\u{2648}-\u{2653}]|[\u{265F}-\u{2660}]|[\u{2663}]|[\u{2665}-\u{2666}]|[\u{2668}]|[\u{267B}]|[\u{267E}-\u{267F}]|[\u{2692}-\u{2697}]|[\u{2699}]|[\u{269B}-\u{269C}]|[\u{26A0}-\u{26A1}]|[\u{26AA}-\u{26AB}]|[\u{26B0}-\u{26B1}]|[\u{26BD}-\u{26BE}]|[\u{26C4}-\u{26C5}]|[\u{26C8}]|[\u{26CE}-\u{26CF}]|[\u{26D1}]|[\u{26D3}-\u{26D4}]|[\u{26E9}-\u{26EA}]|[\u{26F0}-\u{26F5}]|[\u{26F7}-\u{26FA}]|[\u{26FD}]|[\u{2702}]|[\u{2705}]|[\u{2708}-\u{270D}]|[\u{270F}]|[\u{2712}]|[\u{2714}]|[\u{2716}]|[\u{271D}]|[\u{2721}]|[\u{2728}]|[\u{2733}-\u{2734}]|[\u{2744}]|[\u{2747}]|[\u{274C}]|[\u{274E}]|[\u{2753}-\u{2755}]|[\u{2757}]|[\u{2763}-\u{2764}]|[\u{2795}-\u{2797}]|[\u{27A1}]|[\u{27B0}]|[\u{27BF}]|[\u{2934}-\u{2935}]|[\u{2B05}-\u{2B07}]|[\u{2B1B}-\u{2B1C}]|[\u{2B50}]|[\u{2B55}]|[\u{3030}]|[\u{303D}]|[\u{3297}]|[\u{3299}]|[\u{FE0F}]|[\u{200D}]/gu;

// Extensiones de archivos de código a procesar
const codeExtensions = ['.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.scss', '.html', '.md', '.sql'];

// Directorios a ignorar
const ignoreDirs = ['node_modules', '.git', 'dist', 'build', '.next', 'cache', 'temp', '.vscode', '.idea'];

let totalLines = 0;
let filesProcessed = 0;
let emojisRemoved = 0;
let filesWithEmojis = 0;

function shouldIgnoreDir(dirName) {
  return ignoreDirs.some(ignoreDir => dirName === ignoreDir || dirName.startsWith('.'));
}

function isCodeFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return codeExtensions.includes(ext);
}

function removeEmojis(content) {
  emojiRegex.lastIndex = 0;
  const matches = content.match(emojiRegex);
  if (matches) {
    emojisRemoved += matches.length;
    emojiRegex.lastIndex = 0;
    return content.replace(emojiRegex, '');
  }
  return content;
}

function processFile(filePath) {
  // Excluir el propio script
  if (path.basename(filePath) === 'remove-emojis-and-count-lines.js') {
    return;
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    totalLines += lines.length;
    
    // Resetear el regex para que funcione correctamente
    emojiRegex.lastIndex = 0;
    const hasEmojis = emojiRegex.test(content);
    if (hasEmojis) {
      filesWithEmojis++;
      emojiRegex.lastIndex = 0;
      const cleanedContent = removeEmojis(content);
      fs.writeFileSync(filePath, cleanedContent, 'utf8');
      console.log(`✓ Procesado: ${filePath}`);
    }
    
    filesProcessed++;
  } catch (error) {
    console.error(`✗ Error procesando ${filePath}:`, error.message);
  }
}

function walkDirectory(dirPath, basePath = '') {
  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const relativePath = path.join(basePath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        if (!shouldIgnoreDir(item)) {
          walkDirectory(fullPath, relativePath);
        }
      } else if (stat.isFile() && isCodeFile(fullPath)) {
        processFile(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error accediendo a ${dirPath}:`, error.message);
  }
}

console.log(' Iniciando limpieza de emojis y conteo de líneas...\n');

// Procesar directorios principales
const rootDirs = ['app/src', 'dashboard-admin/src', 'server/src'];

for (const dir of rootDirs) {
  const fullPath = path.join(__dirname, dir);
  if (fs.existsSync(fullPath)) {
    console.log(`\n Procesando: ${dir}`);
    walkDirectory(fullPath, dir);
  }
}

// También procesar archivos en la raíz si existen
const rootFiles = fs.readdirSync(__dirname).filter(item => {
  const fullPath = path.join(__dirname, item);
  return fs.statSync(fullPath).isFile() && isCodeFile(fullPath);
});

for (const file of rootFiles) {
  processFile(path.join(__dirname, file));
}

console.log('\n' + '='.repeat(60));
console.log(' RESUMEN:');
console.log('='.repeat(60));
console.log(`Total de archivos procesados: ${filesProcessed}`);
console.log(`Total de líneas de código: ${totalLines.toLocaleString()}`);
console.log(`Archivos con emojis encontrados: ${filesWithEmojis}`);
console.log(`Total de emojis eliminados: ${emojisRemoved}`);
console.log('='.repeat(60));
console.log(' Proceso completado!');
