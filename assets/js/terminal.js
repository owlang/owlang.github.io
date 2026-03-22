---
---
// Terminal animation script
(function() {
    // Commands data - Jekyll will inject this
    const commandsData = {{ site.data.terminal | jsonify }};
    
    // Group commands by index
    const commandsByIndex = {};
    commandsData.forEach(cmd => {
      if (!commandsByIndex[cmd.index]) {
        commandsByIndex[cmd.index] = [];
      }
      commandsByIndex[cmd.index].push(cmd);
  });
  
  // Randomly select one command for each index (1-7)
  const selectedCommands = [];
  for (let i = 1; i <= 7; i++) {
    const options = commandsByIndex[i] || [];
    if (options.length > 0) {
      const randomIndex = Math.floor(Math.random() * options.length);
      selectedCommands.push(options[randomIndex]);
    }
  }
  
  const terminal = document.getElementById('terminal');
  let currentIndex = 0;
  let typingTimeout;
  
  function clearTerminal() {
    terminal.innerHTML = '';
  }
  
  function createLine(type, content = '') {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    
    if (type === 'command') {
      const prompt = document.createElement('span');
      prompt.className = 'prompt';
      prompt.textContent = '$ ';
      
      const cmd = document.createElement('span');
      cmd.className = 'command';
      cmd.textContent = content;
      
      line.appendChild(prompt);
      line.appendChild(cmd);
    } else if (type === 'output') {
      const output = document.createElement('div');
      output.className = 'output';
      output.textContent = content;
      line.appendChild(output);
    } else if (type === 'cursor') {
      const prompt = document.createElement('span');
      prompt.className = 'prompt';
      prompt.textContent = '$ ';
      
      const cursor = document.createElement('span');
      cursor.className = 'cursor';
      
      line.appendChild(prompt);
      line.appendChild(cursor);
    }
    
    return line;
  }
  
  function typeCommand(text, callback) {
    const line = createLine('command');
    const prompt = line.querySelector('.prompt');
    const cmdSpan = line.querySelector('.command');
    cmdSpan.textContent = '';
    
    terminal.appendChild(line);
    
    let i = 0;
    function typeChar() {
      if (i < text.length) {
        cmdSpan.textContent += text[i];
        i++;
        typingTimeout = setTimeout(typeChar, 30);
      } else {
        if (callback) callback();
      }
    }
    typeChar();
  }
  
  function showOutput(lines, callback) {
    let lineIndex = 0;
    
    function showNextLine() {
      if (lineIndex < lines.length) {
        const outputLine = createLine('output', lines[lineIndex]);
        terminal.appendChild(outputLine);
        lineIndex++;
        typingTimeout = setTimeout(showNextLine, 400);
      } else {
        if (callback) callback();
      }
    }
    showNextLine();
  }
  
  function runCommand(cmdObj, callback) {
    typeCommand(cmdObj.command, () => {
      setTimeout(() => {
        showOutput(cmdObj.stdout, callback);
      }, 200);
    });
  }
  
  function runSequence() {
    if (currentIndex < selectedCommands.length) {
      const delay = currentIndex === 0 ? 500 : 800;
      setTimeout(() => {
        runCommand(selectedCommands[currentIndex], () => {
          currentIndex++;
          runSequence();
        });
      }, delay);
    } else {
      // Add cursor at the end
      setTimeout(() => {
        const cursorLine = createLine('cursor');
        terminal.appendChild(cursorLine);
        
        // // Restart after a pause
        // setTimeout(() => {
        //   clearTerminal();
        //   currentIndex = 0;
          
        //   // Re-randomize commands for next iteration
        //   selectedCommands.length = 0;
        //   for (let i = 1; i <= 7; i++) {
        //     const options = commandsByIndex[i] || [];
        //     if (options.length > 0) {
        //       const randomIndex = Math.floor(Math.random() * options.length);
        //       selectedCommands.push(options[randomIndex]);
        //     }
        //   }
          
        //   runSequence();
        // }, 4000);
      }, 800);
    }
  }
  
  // Start the animation
  runSequence();
})();