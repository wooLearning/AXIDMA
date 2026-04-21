    const lucide = {
      createIcons() {
        const icons = {
          "alert-triangle": "<path d='M10.3 3.9 2.6 17.2a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z'/><path d='M12 9v4'/><path d='M12 17h.01'/>",
          "arrow-down": "<path d='M12 5v14'/><path d='m19 12-7 7-7-7'/>",
          "arrow-right-left": "<path d='m16 3 4 4-4 4'/><path d='M20 7H4'/><path d='m8 21-4-4 4-4'/><path d='M4 17h16'/>",
          "arrow-up": "<path d='M12 19V5'/><path d='m5 12 7-7 7 7'/>",
          "bookmark": "<path d='M19 21 12 17 5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16Z'/>",
          "check": "<path d='m20 6-11 11-5-5'/>",
          "check-circle-2": "<path d='M9 12l2 2 4-4'/><circle cx='12' cy='12' r='10'/>",
          "chevron-left": "<path d='m15 18-6-6 6-6'/>",
          "chevron-right": "<path d='m9 18 6-6-6-6'/>",
          "cpu": "<rect x='4' y='4' width='16' height='16' rx='2'/><rect x='9' y='9' width='6' height='6'/><path d='M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3'/>",
          "download": "<path d='M12 3v12'/><path d='m7 10 5 5 5-5'/><path d='M5 21h14'/>",
          "file-image": "<path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z'/><path d='M14 2v6h6'/><circle cx='10' cy='13' r='2'/><path d='m20 17-3-3-5 5'/>",
          "file-key-2": "<path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z'/><path d='M14 2v6h6'/><circle cx='10' cy='16' r='2'/><path d='m12 14 4-4 2 2-1 1 1 1'/>",
          "file-text": "<path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z'/><path d='M14 2v6h6'/><path d='M8 13h8M8 17h8M8 9h2'/>",
          "help-circle": "<circle cx='12' cy='12' r='10'/><path d='M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2-3 4'/><path d='M12 17h.01'/>",
          "info": "<circle cx='12' cy='12' r='10'/><path d='M12 16v-4'/><path d='M12 8h.01'/>",
          "layers": "<path d='m12 2 9 5-9 5-9-5 9-5Z'/><path d='m3 12 9 5 9-5'/><path d='m3 17 9 5 9-5'/>",
          "loader": "<path d='M21 12a9 9 0 1 1-6.2-8.6'/>",
          "lock": "<rect x='3' y='11' width='18' height='11' rx='2'/><path d='M7 11V7a5 5 0 0 1 10 0v4'/>",
          "more-vertical": "<circle cx='12' cy='5' r='1'/><circle cx='12' cy='12' r='1'/><circle cx='12' cy='19' r='1'/>",
          "play": "<path d='m8 5 11 7-11 7V5Z'/>",
          "save": "<path d='M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z'/><path d='M17 21v-8H7v8'/><path d='M7 3v5h8'/>",
          "server": "<rect x='3' y='4' width='18' height='7' rx='2'/><rect x='3' y='13' width='18' height='7' rx='2'/><path d='M7 8h.01M7 17h.01'/>",
          "settings": "<path d='M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z'/><path d='M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1A2 2 0 1 1 4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1A2 2 0 1 1 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3h.1A1.7 1.7 0 0 0 10 3.1V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1A2 2 0 1 1 19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.6.9h.1a2 2 0 1 1 0 4H21a1.7 1.7 0 0 0-1.6 1Z'/>",
          "upload": "<path d='M12 21V9'/><path d='m17 14-5-5-5 5'/><path d='M5 3h14'/>",
          "zap": "<path d='M13 2 3 14h9l-1 8 10-12h-9l1-8Z'/>"
        };

        document.querySelectorAll("i[data-lucide]").forEach(icon => {
          const name = icon.getAttribute("data-lucide");
          const className = `${icon.className} inline-icon`.trim();
          const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          svg.setAttribute("viewBox", "0 0 24 24");
          svg.setAttribute("fill", "none");
          svg.setAttribute("stroke", "currentColor");
          svg.setAttribute("stroke-width", "2");
          svg.setAttribute("stroke-linecap", "round");
          svg.setAttribute("stroke-linejoin", "round");
          svg.setAttribute("class", className);
          svg.setAttribute("aria-hidden", "true");
          if (!/\bw-/.test(className)) svg.classList.add("w-5");
          if (!/\bh-/.test(className)) svg.classList.add("h-5");
          svg.innerHTML = icons[name] || "<circle cx='12' cy='12' r='9'/>";
          icon.replaceWith(svg);
        });
      }
    };

    lucide.createIcons();

    // Tab Switching Logic
    function switchTab(tabId) {
      document.querySelectorAll('.tab-content').forEach(el => {
        el.classList.remove('active');
      });
      
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.className = "tab-btn px-4 py-2 rounded-lg text-[13px] font-semibold transition-all text-[#8b95a1] hover:text-[#4e5968] hover:bg-gray-200/50";
      });

      document.querySelectorAll('.mob-btn').forEach(btn => {
        btn.className = "mob-btn shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 bg-gray-50 border border-gray-200";
      });
      
      const content = document.getElementById(tabId + '-section');
      if(content) {
        content.classList.add('active');
      }
      
      const activeDesktopBtn = document.getElementById('nav-' + tabId);
      if(activeDesktopBtn) {
        activeDesktopBtn.className = "tab-btn px-4 py-2 rounded-lg text-[13px] font-semibold transition-all bg-white text-[#191f28] shadow-sm";
      }

      const activeMobileBtn = document.getElementById('mob-' + tabId);
      if(activeMobileBtn) {
        activeMobileBtn.className = "mob-btn shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#191f28] text-white border border-[#191f28]";
      }
    }

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // AXI4 Transaction Animation Logic (from chapter 2)
    let isAxiAnimating = false;

    async function showStatus(text, colorClass) {
      const box = document.getElementById('axi-status-box');
      if(!box) return;
      box.innerHTML = text;
      box.className = `absolute top-4 left-1/2 -translate-x-1/2 bg-gray-900 border ${colorClass} px-6 py-2 rounded-xl text-sm font-bold text-center transition-all duration-300 shadow-lg text-white`;
      box.style.opacity = '1';
    }

    function createPacket(text, channelClass, topPos, direction) {
      const layer = document.getElementById('packet-layer');
      if(!layer) return;
      const packet = document.createElement('div');
      packet.className = `packet absolute ${channelClass} text-[10px] font-bold px-3 py-1.5 rounded-md shadow-md flex items-center gap-1`;
      
      if(direction === 'right') {
        packet.style.left = '4rem';
      } else {
        packet.style.right = '4rem';
      }
      packet.style.top = topPos;
      packet.innerHTML = text;
      layer.appendChild(packet);
      
      void packet.offsetWidth;
      
      packet.classList.add(direction === 'right' ? 'moving-right' : 'moving-left');
      
      setTimeout(() => {
        if (packet.parentNode) {
          packet.style.opacity = '0';
          setTimeout(() => packet.remove(), 500);
        }
      }, 1000);
    }

    async function runAxiReadBurst() {
      if (isAxiAnimating) return;
      isAxiAnimating = true;
      document.getElementById('btn-axi-read').classList.add('opacity-50', 'cursor-not-allowed');
      document.getElementById('btn-axi-write').classList.add('opacity-50', 'cursor-not-allowed');

      await showStatus("Step 1: AR 채널 (Read Address 전송)", "border-blue-400 text-blue-400");
      createPacket("ARADDR=0x1000, ARLEN=3", "bg-blue-600 text-white", "11%", "right");
      await sleep(1500);

      await showStatus("Step 2: R 채널 (Burst Data 수신 중...)", "border-blue-300 text-blue-300");
      for(let i=0; i<3; i++) {
        createPacket(`RDATA Beat ${i+1}`, "bg-blue-500 text-white", "26%", "left");
        await sleep(400);
      }

      await showStatus("Step 3: R 채널 (마지막 Data + RLAST)", "border-red-400 text-red-400");
      createPacket(`RDATA Beat 4 + <span class="bg-red-500 px-1 rounded">RLAST=1</span>`, "bg-blue-500 text-white", "26%", "left");
      await sleep(1500);

      await showStatus("Read Burst Transaction 완료!", "border-green-400 text-green-400");
      await sleep(2000);
      const box = document.getElementById('axi-status-box');
      if(box) box.style.opacity = '0';
      
      document.getElementById('btn-axi-read').classList.remove('opacity-50', 'cursor-not-allowed');
      document.getElementById('btn-axi-write').classList.remove('opacity-50', 'cursor-not-allowed');
      isAxiAnimating = false;
    }

    async function runAxiWriteBurst() {
      if (isAxiAnimating) return;
      isAxiAnimating = true;
      document.getElementById('btn-axi-read').classList.add('opacity-50', 'cursor-not-allowed');
      document.getElementById('btn-axi-write').classList.add('opacity-50', 'cursor-not-allowed');

      await showStatus("Step 1: AW 채널 (Write Address 전송)", "border-green-400 text-green-400");
      createPacket("AWADDR=0x2000, AWLEN=3", "bg-green-600 text-white", "41%", "right");
      await sleep(1500);

      await showStatus("Step 2: W 채널 (Burst Data 송신 중...)", "border-green-300 text-green-300");
      for(let i=0; i<3; i++) {
        createPacket(`WDATA Beat ${i+1}`, "bg-green-500 text-white", "56%", "right");
        await sleep(400);
      }

      await showStatus("Step 3: W 채널 (마지막 Data + WLAST)", "border-red-400 text-red-400");
      createPacket(`WDATA Beat 4 + <span class="bg-red-500 px-1 rounded">WLAST=1</span>`, "bg-green-500 text-white", "56%", "right");
      await sleep(1500);

      await showStatus("Step 4: B 채널 (Write Response 수신)", "border-orange-400 text-orange-400");
      createPacket("BRESP=OKAY", "bg-red-600 text-white", "71%", "left");
      await sleep(1500);

      await showStatus("Write Burst Transaction 완료!", "border-green-400 text-green-400");
      await sleep(2000);
      const box = document.getElementById('axi-status-box');
      if(box) box.style.opacity = '0';
      
      document.getElementById('btn-axi-read').classList.remove('opacity-50', 'cursor-not-allowed');
      document.getElementById('btn-axi-write').classList.remove('opacity-50', 'cursor-not-allowed');
      isAxiAnimating = false;
    }

    // ADVANCED SG ANIMATION LOGIC (Chapter 4)
    let isSGAnimating = false;

    async function runSGAnimation() {
      if (isSGAnimating) return;
      isSGAnimating = true;

      const btn = document.getElementById('runSgBtn');
      btn.innerHTML = `<i data-lucide="loader" class="w-4 h-4 animate-spin"></i> Processing...`;
      lucide.createIcons();
      btn.classList.add('opacity-50', 'cursor-not-allowed');

      const pointer = document.getElementById('dmaEnginePointer');
      const dmaIcon = document.getElementById('dmaIcon');
      
      const bd0 = document.getElementById('bd-0');
      const bd1 = document.getElementById('bd-1');
      const bd2 = document.getElementById('bd-2');
      
      const bd0Status = document.getElementById('bd-0-status');
      const bd1Status = document.getElementById('bd-1-status');
      
      const dataChunk0 = document.getElementById('data-chunk-0');
      const dataProg0 = document.getElementById('data-prog-0');
      const dataChunk1 = document.getElementById('data-chunk-1');
      const dataProg1 = document.getElementById('data-prog-1');

      // Reset
      pointer.style.opacity = '0';
      pointer.style.top = '40px';
      
      bd0.className = "bd-card bg-white shadow-sm rounded-lg overflow-hidden";
      bd1.className = "bd-card bg-white shadow-sm rounded-lg overflow-hidden";
      bd2.className = "bd-card bg-white border-dashed shadow-sm rounded-lg overflow-hidden opacity-60";
      
      dataChunk0.className = "data-chunk bg-gray-50 p-4 rounded-lg relative overflow-hidden";
      dataProg0.style.width = '0%';
      dataChunk1.className = "data-chunk bg-gray-50 p-4 rounded-lg relative overflow-hidden";
      dataProg1.style.width = '0%';

      bd0Status.innerHTML = "Waiting";
      bd0Status.className = "italic text-gray-500";
      bd1Status.innerHTML = "Waiting";
      bd1Status.className = "italic text-gray-500";

      document.getElementById('bd-0-tag').classList.remove('hidden');
      document.getElementById('bd-2-tag').classList.remove('hidden');

      await sleep(800);

      // Fetch BD0
      pointer.style.opacity = '1';
      dmaIcon.className = "w-4 h-4 text-[#3182f6] animate-pulse";
      bd0.classList.add('bd-active');
      bd0Status.innerHTML = `<i data-lucide="loader" class="w-3 h-3 animate-spin"></i> Fetching...`;
      bd0Status.className = "font-bold text-[#3182f6] flex items-center gap-1";
      lucide.createIcons();
      await sleep(1500);

      // Transfer BD0 (Gather Data)
      dmaIcon.className = "w-4 h-4 text-purple-500 animate-pulse";
      dataChunk0.classList.add('data-chunk-active');
      bd0Status.innerHTML = `<i data-lucide="arrow-right-left" class="w-3 h-3 animate-pulse"></i> Transferring 4KB...`;
      bd0Status.className = "font-bold text-purple-600 flex items-center gap-1";
      lucide.createIcons();
      
      // Animate progress manually
      dataProg0.style.transition = 'width 1.5s linear';
      dataProg0.style.width = '100%';
      await sleep(1500);
      
      dataChunk0.classList.remove('data-chunk-active');
      dataChunk0.classList.add('data-chunk-done');

      // Update BD0
      dmaIcon.className = "w-4 h-4 text-[#f59e0b] animate-spin";
      bd0.classList.remove('bd-active');
      bd0.classList.add('bd-updating');
      bd0Status.innerHTML = `<i data-lucide="save" class="w-3 h-3"></i> Updating Status...`;
      bd0Status.className = "font-bold text-[#f59e0b] flex items-center gap-1";
      lucide.createIcons();
      await sleep(1000);

      // Complete BD0
      bd0.classList.remove('bd-updating');
      bd0.classList.add('bd-completed');
      bd0Status.innerHTML = `<i data-lucide="check" class="w-3 h-3"></i> Complete`;
      bd0Status.className = "font-bold text-[#22c55e] flex items-center gap-1";
      lucide.createIcons();
      await sleep(800);

      // Move to BD1 ----------------------------------------
      pointer.style.top = '145px'; 
      dmaIcon.className = "w-4 h-4 text-[#3182f6] animate-pulse";
      await sleep(800);

      // Fetch BD1
      bd1.classList.add('bd-active');
      bd1Status.innerHTML = `<i data-lucide="loader" class="w-3 h-3 animate-spin"></i> Fetching...`;
      bd1Status.className = "font-bold text-[#3182f6] flex items-center gap-1";
      lucide.createIcons();
      await sleep(1500);

      // Transfer BD1 (Gather Data)
      dmaIcon.className = "w-4 h-4 text-pink-500 animate-pulse";
      dataChunk1.classList.add('data-chunk-active');
      bd1Status.innerHTML = `<i data-lucide="arrow-right-left" class="w-3 h-3 animate-pulse"></i> Transferring 2KB...`;
      bd1Status.className = "font-bold text-pink-600 flex items-center gap-1";
      lucide.createIcons();
      
      dataProg1.style.transition = 'width 1s linear';
      dataProg1.style.width = '100%';
      await sleep(1000);
      
      dataChunk1.classList.remove('data-chunk-active');
      dataChunk1.classList.add('data-chunk-done');

      // Update BD1
      dmaIcon.className = "w-4 h-4 text-[#f59e0b] animate-spin";
      bd1.classList.remove('bd-active');
      bd1.classList.add('bd-updating');
      bd1Status.innerHTML = `<i data-lucide="save" class="w-3 h-3"></i> Updating (EOF)...`;
      bd1Status.className = "font-bold text-[#f59e0b] flex items-center gap-1";
      lucide.createIcons();
      await sleep(1000);

      // Complete BD1
      bd1.classList.remove('bd-updating');
      bd1.classList.add('bd-completed');
      bd1Status.innerHTML = `<i data-lucide="check-circle-2" class="w-3 h-3"></i> Complete`;
      bd1Status.className = "font-bold text-[#22c55e] flex items-center gap-1";
      lucide.createIcons();
      await sleep(800);

      // Check Tail ----------------------------------------
      pointer.style.top = '270px';
      dmaIcon.className = "w-4 h-4 text-red-500 animate-bounce";
      await sleep(800);

      bd2.classList.add('bd-active');
      document.getElementById('bd-2-tag').classList.add('animate-pulse');
      document.getElementById('bd-2-tag').classList.remove('hidden');
      await sleep(1500);

      // Interrupt
      dmaIcon.className = "w-4 h-4 text-[#22c55e]";
      lucide.createIcons();
      await sleep(2000);
      
      pointer.style.opacity = '0';
      document.getElementById('bd-2-tag').classList.remove('animate-pulse');
      bd2.classList.remove('bd-active');

      btn.innerHTML = `<i data-lucide="play" class="w-4 h-4"></i> SG 리스트 재실행`;
      btn.classList.remove('opacity-50', 'cursor-not-allowed');
      lucide.createIcons();
      isSGAnimating = false;
    }

    // CSR Bitfield Hover Logic (Chapter 5)
    function showDesc(elementId, text) {
      const box = document.getElementById(elementId);
      if(box) box.innerText = text;
    }

    // TEA Pipeline Animation Logic (Chapter 6)
    let isTeaAnimating = false;
    async function runTeaAnimation() {
      if(isTeaAnimating) return;
      isTeaAnimating = true;

      const btn = document.getElementById('btn-tea');
      btn.innerHTML = `<i data-lucide="loader" class="w-4 h-4 animate-spin"></i> 암호화 중...`;
      btn.classList.add('opacity-50', 'cursor-not-allowed');
      lucide.createIcons();

      const txChannel = document.getElementById('tea-tx-channel');
      const rxChannel = document.getElementById('tea-rx-channel');
      const teaCore = document.getElementById('tea-core');
      const teaLock = document.getElementById('tea-lock-icon');

      const txDist = txChannel.offsetWidth;
      const rxDist = rxChannel.offsetWidth;

      // Pulse Core
      teaCore.classList.replace('bg-orange-400', 'bg-red-500');
      teaCore.classList.replace('border-orange-500', 'border-red-600');
      teaLock.classList.add('animate-pulse');

      for(let i=0; i<5; i++) {
        // 1. Plaintext Packet (Blue) enters TX Channel
        const pPacket = document.createElement('div');
        pPacket.className = `absolute top-1/2 -translate-y-1/2 w-8 h-6 bg-[#3182f6] rounded text-white text-[8px] font-bold flex items-center justify-center shadow-md transition-transform duration-1000 linear z-20`;
        pPacket.style.left = '-32px';
        pPacket.innerText = `P${i}`;
        txChannel.appendChild(pPacket);
        void pPacket.offsetWidth;
        pPacket.style.transform = `translate(${txDist + 32}px, -50%)`;

        setTimeout(() => {
          if (pPacket && pPacket.parentNode) pPacket.remove(); // enters core
          
          // 2. Core glows slightly
          teaCore.style.transform = 'scale(1.05)';
          setTimeout(() => teaCore.style.transform = 'scale(1)', 150);

          // 3. Ciphertext Packet (Red) exits RX Channel
          const cPacket = document.createElement('div');
          cPacket.className = `absolute top-1/2 -translate-y-1/2 w-8 h-6 bg-red-500 rounded text-white text-[8px] font-bold flex items-center justify-center shadow-md transition-transform duration-1000 linear z-20`;
          cPacket.style.left = '-32px';
          cPacket.innerText = `C${i}`;
          rxChannel.appendChild(cPacket);
          void cPacket.offsetWidth;
          cPacket.style.transform = `translate(${rxDist + 32}px, -50%)`;

          setTimeout(() => {
            if (cPacket && cPacket.parentNode) cPacket.remove(); // enters dest memory
          }, 1000);

        }, 1000); // Wait for TX to finish

        await sleep(500); // Space out packets
      }

      await sleep(3000); // Wait for all to finish

      // Reset Core
      teaCore.classList.replace('bg-red-500', 'bg-orange-400');
      teaCore.classList.replace('border-red-600', 'border-orange-500');
      teaLock.classList.remove('animate-pulse');

      btn.innerHTML = `<i data-lucide="lock" class="w-4 h-4"></i> 암호화 파이프라인 가동`;
      btn.classList.remove('opacity-50', 'cursor-not-allowed');
      lucide.createIcons();
      isTeaAnimating = false;
    }
