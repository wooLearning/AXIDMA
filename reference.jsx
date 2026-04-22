import React, { useState, useEffect, useCallback } from 'react';
import { 
  Cpu, Server, Layers, ArrowDown, ArrowUp, ChevronRight, ChevronLeft, 
  Zap, Play, Download, Upload, HelpCircle,  
  FileText, Lock, FileKey2, AlertTriangle, Loader, Save, Check, 
  Info, Flag, ArrowRightLeft, Settings as SettingsIcon, MonitorPlay, CheckSquare, Bug, HardDrive, RefreshCcw, Network
} from 'lucide-react';

/* =====================================================================
   공통 UI 컴포넌트
===================================================================== */
const TabButton = ({ active, onClick, children, isMobile }) => {
  if (isMobile) {
    return (
      <button 
        onClick={onClick}
        className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
          active ? 'font-bold bg-[#191f28] text-white border border-[#191f28]' : 'text-gray-500 bg-gray-50 border border-gray-200'
        }`}
      >
        {children}
      </button>
    );
  }
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all whitespace-nowrap ${
        active ? 'bg-white text-[#191f28] shadow-sm' : 'text-[#8b95a1] hover:text-[#4e5968] hover:bg-gray-200/50'
      }`}
    >
      {children}
    </button>
  );
};

const SectionHeader = ({ chapter, title, subtitle }) => (
  <div className="space-y-4 border-b border-gray-200 pb-6">
    <span className="text-[#3182f6] font-bold text-sm tracking-wide">{chapter}</span>
    <h2 className="text-3xl font-extrabold text-[#191f28]">{title}</h2>
    <p className="text-[#4e5968] text-lg">{subtitle}</p>
  </div>
);

/* 애니메이션 패킷 컴포넌트 */
const AnimatedPacket = ({ packetType, text, flagText, index, isLast, className, startLeft, targetTransform, duration, onComplete }) => {
  const [style, setStyle] = useState({ 
    left: startLeft, 
    transform: 'translateX(0)', 
    opacity: 1, 
    transition: `transform ${duration}ms linear, opacity 0.3s` 
  });

  useEffect(() => {
    const moveTimer = setTimeout(() => {
      setStyle(s => ({ ...s, transform: targetTransform }));
    }, 50);
    
    const fadeTimer = setTimeout(() => {
      setStyle(s => ({ ...s, opacity: 0 }));
    }, duration - 300);
    
    const killTimer = setTimeout(() => {
      onComplete();
    }, duration);

    return () => { clearTimeout(moveTimer); clearTimeout(fadeTimer); clearTimeout(killTimer); };
  }, [targetTransform, duration, onComplete]);

  return (
    <div className={`absolute text-[10px] font-bold px-3 py-1.5 rounded-md shadow-md flex items-center gap-1 z-20 ${className}`} style={style}>
      {packetType === 'axi4' && (
        <>
          <span>{text}</span>
          {flagText && <span className="bg-red-500 px-1 rounded">{flagText}</span>}
        </>
      )}
      {packetType === 'stream' && (
        isLast ? (
          <>TDATA <div className="ml-2 bg-white text-red-600 px-1.5 py-0.5 rounded flex items-center gap-1 font-black text-[9px]"><Flag className="w-3 h-3"/> TLAST=1</div></>
        ) : (
          <>TDATA <span className="text-blue-300 ml-1 font-mono">D{index}</span></>
        )
      )}
      {packetType === 'tea' && (
        <>{text}</>
      )}
    </div>
  );
};

/* =====================================================================
   Chapter 1
===================================================================== */
function Chapter1BigPicture() {
  return (
    <div className="space-y-10 animate-[fadeIn_0.4s_ease-out]">
      <SectionHeader 
        chapter="Chapter 1. System-Level Overview"
        title="AXI DMA의 정확한 역할과 IP 패밀리"
        subtitle="단순히 Stream만 쓰는 것이 아닙니다. 규격이 다른 두 세계(Memory와 Stream)를 잇는 '통역사'입니다."
      />

      <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
        <h3 className="text-xl font-bold text-[#191f28] mb-4">1.1 DMA는 무엇을, 어떻게 연결하는가? (3가지 인터페이스)</h3>
        <p className="text-[15px] text-[#4e5968] mb-6 leading-relaxed">
          흔히 <strong>"DMA는 AXI-Stream으로만 읽고 쓰는가? DDR RAM만 접근하는가?"</strong>라고 헷갈리기 쉽습니다. <br/>
          결론부터 말하면 AXI DMA는 <strong>'주소가 있는 세계(DDR RAM 등)'</strong>와 <strong>'주소가 없는 세계(하드웨어 IP)'</strong> 사이에서 데이터를 변환하고 쏟아부어주는 <strong>통역사이자 거대한 펌프(Bridge)</strong>입니다. 이를 위해 DMA는 3가지의 전혀 다른 AXI 인터페이스를 동시에 가집니다.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-[#f3e8ff] p-5 rounded-xl border border-purple-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 text-purple-700"><SettingsIcon /></div>
              <h4 className="font-bold text-purple-900 text-[14px]">1. AXI-Lite (명령 수신용)</h4>
            </div>
            <p className="text-[13px] text-purple-800 leading-relaxed">
              <strong>CPU와 통신하는 '귀' 역할.</strong> 데이터가 아닌 제어 명령만 받습니다. CPU가 이 버스를 통해 DMA 내부 레지스터에 "어디서 어디로 얼만큼 전송해라"라고 세팅합니다.
            </p>
          </div>
          
          <div className="bg-[#eff7ff] p-5 rounded-xl border border-blue-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Server className="w-5 h-5 text-[#3182f6]" />
              <h4 className="font-bold text-blue-900 text-[14px]">2. AXI4 Full (메모리 접근용)</h4>
            </div>
            <p className="text-[13px] text-blue-800 leading-relaxed">
              <strong>DDR RAM과 통신하는 '팔' 역할.</strong> 주소(Address)를 가지고 메모리에 접근해 대용량 데이터를 고속 버스트(Burst)로 퍼 나릅니다. (MM2S: 읽기, S2MM: 쓰기)
            </p>
          </div>

          <div className="bg-[#ecfdf5] p-5 rounded-xl border border-green-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Cpu className="w-5 h-5 text-green-600" />
              <h4 className="font-bold text-green-900 text-[14px]">3. AXI-Stream (IP 통신용)</h4>
            </div>
            <p className="text-[13px] text-green-800 leading-relaxed">
              <strong>타겟 하드웨어(IP)와 통신하는 '입' 역할.</strong> 암호화 코어, 비디오 필터 등과 1:1로 직통 연결되어 주소 없이 데이터만 물 흐르듯 끊임없이 쏟아냅니다.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-bold text-[#191f28] mb-6">1.2 SoC 아키텍처 블록 다이어그램</h3>
        <div className="bg-[#f8f9fa] border border-[#e5e8eb] p-6 rounded-xl flex flex-col items-center">
          <div className="w-full max-w-4xl relative">
            <div className="flex justify-between items-start mb-10">
              <div className="w-40 flex flex-col items-center">
                <div className="w-full bg-white border-[3px] border-[#191f28] rounded-xl p-4 shadow-md text-center z-10 relative">
                  <Cpu className="w-8 h-8 text-[#191f28] mx-auto mb-2" />
                  <span className="font-extrabold text-[#191f28] block">Processor</span>
                  <span className="absolute -right-4 -bottom-4 bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-1 rounded shadow-sm border border-purple-200">AXI Master</span>
                </div>
                <div className="h-10 border-l-4 border-dashed border-[#8b5cf6] flex items-center justify-center -mb-2 relative">
                  <span className="absolute left-4 bg-[#f3e8ff] text-[#7c3aed] text-[10px] font-bold px-2 py-0.5 rounded border border-[#d8b4fe] whitespace-nowrap">Config (AXI-Lite)</span>
                </div>
                <ArrowDown className="text-[#8b5cf6] z-10" />
              </div>

              <div className="w-48 flex flex-col items-center">
                <div className="w-full bg-white border-[3px] border-gray-400 rounded-xl p-4 shadow-md text-center z-10 relative">
                  <Server className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <span className="font-extrabold text-gray-700 block">System Memory</span>
                  <span className="absolute -left-4 -bottom-4 bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-1 rounded shadow-sm border border-gray-300">AXI Slave</span>
                </div>
                <div className="flex w-full justify-between mt-2">
                  <div className="flex flex-col items-center relative">
                     <ArrowUp className="text-[#3182f6] -mt-1 z-10" />
                     <div className="h-12 border-l-4 border-[#3182f6]"></div>
                  </div>
                  <div className="flex flex-col items-center relative">
                     <ArrowDown className="text-[#22c55e] -mt-1 z-10" />
                     <div className="h-12 border-l-4 border-[#22c55e]"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full h-12 bg-gray-200 border-y-2 border-gray-300 flex items-center justify-center shadow-inner relative rounded">
              <span className="font-extrabold text-gray-500 tracking-widest uppercase">AXI Interconnect (System Bus)</span>
            </div>

            <div className="flex justify-between items-start mt-8">
              <div className="w-[340px] bg-[#eff7ff] border-[3px] border-[#3182f6] rounded-xl p-4 shadow-md z-10 relative">
                <div className="absolute -top-3 left-6 bg-[#3182f6] text-white text-[10px] font-bold px-2 py-0.5 rounded">AXI DMA Controller</div>
                
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="bg-white border-2 border-purple-400 rounded p-2 text-center shadow-sm relative">
                    <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-[8px] font-bold px-1 rounded">Slave</span>
                    <span className="block font-bold text-[#191f28] text-sm">CSR (Registers)</span>
                    <span className="block text-[10px] text-purple-600">AXI-Lite 설정 수신</span>
                  </div>
                  <div className="bg-white border border-gray-200 rounded p-2 text-center shadow-sm">
                    <span className="block font-bold text-red-500 text-sm">Interrupts</span>
                    <span className="block text-[10px] text-gray-500">완료 시 CPU 알림</span>
                  </div>
                  <div className="bg-white border-2 border-[#3182f6] rounded p-2 text-center shadow-sm flex flex-col justify-center relative">
                    <span className="absolute -top-2 -right-2 bg-[#3182f6] text-white text-[8px] font-bold px-1 rounded">Master</span>
                    <span className="block font-extrabold text-[#3182f6] text-sm">MM2S Engine</span>
                    <span className="block text-[10px] text-gray-500">AXI4 Full (DDR Read)</span>
                  </div>
                  <div className="bg-white border-2 border-[#22c55e] rounded p-2 text-center shadow-sm flex flex-col justify-center relative">
                    <span className="absolute -top-2 -right-2 bg-[#22c55e] text-white text-[8px] font-bold px-1 rounded">Master</span>
                    <span className="block font-extrabold text-[#22c55e] text-sm">S2MM Engine</span>
                    <span className="block text-[10px] text-gray-500">AXI4 Full (DDR Write)</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center relative px-4 mt-12">
                <div className="w-full h-1.5 bg-[#3182f6] relative flex items-center justify-end mb-4">
                  <div className="absolute -top-5 text-[10px] font-bold text-[#3182f6]">M_AXIS_MM2S</div>
                  <ChevronRight className="text-[#3182f6] -mr-2" />
                </div>
                <div className="w-full h-1.5 bg-[#22c55e] relative flex items-center justify-start">
                  <div className="absolute -bottom-5 text-[10px] font-bold text-[#22c55e]">S_AXIS_S2MM</div>
                  <ChevronLeft className="text-[#22c55e] -ml-2" />
                </div>
              </div>

              <div className="w-40 flex flex-col items-center mt-6">
                <div className="w-full bg-[#f4f0ff] border-[3px] border-[#8b5cf6] rounded-xl p-4 shadow-md text-center z-10">
                  <Layers className="w-8 h-8 text-[#8b5cf6] mx-auto mb-2" />
                  <span className="font-extrabold text-[#8b5cf6] block leading-tight">Target HW<br/>(e.g. FFT/Filter)</span>
                  <span className="text-[10px] text-gray-500">(AXI-Stream)</span>
                </div>
              </div>
            </div>

            <div className="absolute left-[64px] top-[108px] h-10 w-1 bg-[#8b5cf6] -z-10"></div>
            <div className="absolute left-[64px] top-[165px] h-8 w-1 bg-[#8b5cf6] -z-10"></div>
            <div className="absolute right-[225px] top-[108px] h-10 w-1 bg-[#3182f6] -z-10"></div>
            <div className="absolute right-[175px] top-[108px] h-10 w-1 bg-[#22c55e] -z-10"></div>
            <div className="absolute left-[140px] top-[165px] h-32 w-1 bg-[#3182f6] -z-10"></div>
            <div className="absolute left-[295px] top-[165px] h-32 w-1 bg-[#22c55e] -z-10"></div>
          </div>
        </div>

        <div className="mt-6 bg-[#fff7ed] p-5 rounded-xl border border-orange-200">
          <h4 className="font-bold text-orange-600 text-sm mb-2 flex items-center gap-1"><Info className="w-4 h-4"/> 참고: Memory-to-Memory 전송을 원한다면?</h4>
          <p className="text-[13px] text-gray-700">
            만약 하드웨어 IP 없이 <strong>단순히 DDR RAM의 A 영역에서 B 영역으로 메모리를 복사</strong>하고 싶다면, AXI DMA(Stream 기반)가 아닌 <strong>AXI CDMA (Central DMA)</strong>라는 별도의 IP를 사용하는 것이 일반적입니다. CDMA는 스트림 포트 없이 AXI4 Full 인터페이스만으로 메모리 간 복사를 수행합니다.
          </p>
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
   Chapter 2
===================================================================== */
function Chapter2Axi4Burst() {
  const [packets, setPackets] = useState([]);
  const [status, setStatus] = useState({ text: '', colorClass: '', visible: false });
  const [isAnimating, setIsAnimating] = useState(false);

  const addPacket = useCallback((text, flagText, channelClass, startLeft, targetTransform, duration) => {
    const id = Date.now() + Math.random();
    setPackets(p => [...p, { id, text, flagText, channelClass, startLeft, targetTransform, duration }]);
    return new Promise(resolve => setTimeout(resolve, duration + 100));
  }, []);

  const removePacket = useCallback((id) => {
    setPackets(p => p.filter(pkt => pkt.id !== id));
  }, []);

  const updateStatus = async (text, colorClass) => {
    setStatus({ text, colorClass, visible: true });
    await new Promise(r => setTimeout(r, 100));
  };

  const runReadBurst = async () => {
    if (isAnimating) return;
    setIsAnimating(true);

    await updateStatus("Step 1: AR 채널 (Read Address 전송)", "border-blue-400 text-blue-400");
    await addPacket("ARADDR=0x1000, ARLEN=3", null, "bg-blue-600 text-white", "4rem", "translateX(300px)", 1000);
    await new Promise(r => setTimeout(r, 500));

    await updateStatus("Step 2: R 채널 (Burst Data 수신 중...)", "border-blue-300 text-blue-300");
    for(let i=0; i<3; i++) {
      addPacket(`RDATA Beat ${i+1}`, null, "bg-blue-500 text-white right-16", "auto", "translateX(-300px)", 1000);
      await new Promise(r => setTimeout(r, 400));
    }

    await new Promise(r => setTimeout(r, 800));
    await updateStatus("Step 3: R 채널 (마지막 Data + RLAST)", "border-red-400 text-red-400");
    await addPacket("RDATA Beat 4 + ", "RLAST=1", "bg-blue-500 text-white right-16", "auto", "translateX(-300px)", 1000);
    
    await updateStatus("Read Burst Transaction 완료!", "border-green-400 text-green-400");
    await new Promise(r => setTimeout(r, 2000));
    setStatus(s => ({ ...s, visible: false }));
    setIsAnimating(false);
  };

  const runWriteBurst = async () => {
    if (isAnimating) return;
    setIsAnimating(true);

    await updateStatus("Step 1: AW 채널 (Write Address 전송)", "border-green-400 text-green-400");
    await addPacket("AWADDR=0x2000, AWLEN=3", null, "bg-green-600 text-white", "4rem", "translateX(300px)", 1000);
    await new Promise(r => setTimeout(r, 500));

    await updateStatus("Step 2: W 채널 (Burst Data 송신 중...)", "border-green-300 text-green-300");
    for(let i=0; i<3; i++) {
      addPacket(`WDATA Beat ${i+1}`, null, "bg-green-500 text-white", "4rem", "translateX(300px)", 1000);
      await new Promise(r => setTimeout(r, 400));
    }

    await new Promise(r => setTimeout(r, 800));
    await updateStatus("Step 3: W 채널 (마지막 Data + WLAST)", "border-red-400 text-red-400");
    await addPacket("WDATA Beat 4 + ", "WLAST=1", "bg-green-500 text-white", "4rem", "translateX(300px)", 1000);

    await updateStatus("Step 4: B 채널 (Write Response 수신)", "border-orange-400 text-orange-400");
    await addPacket("BRESP=OKAY", null, "bg-red-600 text-white right-16", "auto", "translateX(-300px)", 1000);
    
    await updateStatus("Write Burst Transaction 완료!", "border-green-400 text-green-400");
    await new Promise(r => setTimeout(r, 2000));
    setStatus(s => ({ ...s, visible: false }));
    setIsAnimating(false);
  };

  return (
    <div className="space-y-10 animate-[fadeIn_0.4s_ease-out]">
      <SectionHeader 
        chapter="Chapter 2. The Power of AXI4 Full"
        title="데이터 고속도로: AXI4 Full 버스트(Burst) 트랜잭션"
        subtitle="DMA가 대용량 데이터를 빠르고 효율적으로 옮길 수 있는 비결은 AXI4 Full의 '5개 채널'과 '버스트 전송'에 있습니다."
      />

      <div className="bg-white p-8 rounded-2xl border border-[#3182f6] shadow-sm relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl -z-10"></div>
        <h3 className="text-xl font-bold text-[#191f28] mb-4 flex items-center gap-2">
          <Zap className="w-6 h-6 text-[#3182f6]" /> 2.1 AXI-Lite와 AXI4 Full의 결정적 차이
        </h3>
        <div className="grid md:grid-cols-2 gap-6 mt-4">
          <div className="bg-[#f9fafb] p-6 rounded-xl border border-gray-200">
            <h4 className="font-bold text-purple-600 mb-2">AXI-Lite (제어용)</h4>
            <p className="text-[13px] text-gray-600 leading-relaxed">
              <strong>1 주소 = 1 데이터.</strong> CPU가 DMA의 레지스터(예: Source Address)를 세팅할 때 씁니다. 한 번의 주소 전송에 딱 한 번의 데이터만 보냅니다.
            </p>
          </div>
          <div className="bg-[#eff7ff] p-6 rounded-xl border border-blue-200">
            <h4 className="font-bold text-[#3182f6] mb-2">AXI4 Full (데이터용)</h4>
            <p className="text-[13px] text-gray-700 leading-relaxed">
              <strong>1 주소 = N 데이터 (Burst).</strong> DMA가 메모리에서 데이터를 가져올 때 씁니다. 시작 주소 1번만 알려주면, 최대 256개의 연속된 데이터를 연달아 쏟아냅니다.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-bold text-[#191f28] mt-10 mb-6">2.2 AXI4 5개 독립 채널 애니메이션 시뮬레이션</h3>
        <div className="flex gap-4 mb-6">
          <button onClick={runReadBurst} disabled={isAnimating} className="bg-[#3182f6] hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all active:scale-95 shadow-md disabled:opacity-50">
            <Download className="w-4 h-4" /> Read Burst 실행 (AR, R 채널)
          </button>
          <button onClick={runWriteBurst} disabled={isAnimating} className="bg-[#22c55e] hover:bg-green-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all active:scale-95 shadow-md disabled:opacity-50">
            <Upload className="w-4 h-4" /> Write Burst 실행 (AW, W, B 채널)
          </button>
        </div>

        <div className="bg-[#191f28] p-8 rounded-xl relative overflow-hidden h-[360px] flex justify-between items-center text-white border border-gray-800">
          <div className="w-32 h-48 bg-gray-800 border-2 border-gray-600 rounded-xl flex flex-col items-center justify-center z-20 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            <span className="font-extrabold text-[#3182f6]">DMA Core</span>
            <span className="text-xs text-gray-400 mt-1">AXI4 Master</span>
          </div>

          <div className="flex-1 h-full relative">
            {[20, 35, 50, 65, 80].map((top, i) => (
              <div key={i} className="absolute w-full h-px bg-gray-700 border-b border-dashed border-gray-600" style={{top: `${top}%`}}></div>
            ))}
            <div className="absolute left-4 top-[15%] text-[10px] font-bold text-blue-400">AR (Read Address)</div>
            <div className="absolute right-4 top-[30%] text-[10px] font-bold text-blue-300">R (Read Data)</div>
            <div className="absolute left-4 top-[45%] text-[10px] font-bold text-green-400">AW (Write Address)</div>
            <div className="absolute left-4 top-[60%] text-[10px] font-bold text-green-300">W (Write Data)</div>
            <div className="absolute right-4 top-[75%] text-[10px] font-bold text-red-400">B (Write Response)</div>

            {packets.map(pkt => (
              <AnimatedPacket 
                key={pkt.id} packetType="axi4" text={pkt.text} flagText={pkt.flagText} className={pkt.channelClass} startLeft={pkt.startLeft}
                targetTransform={pkt.targetTransform} duration={pkt.duration} onComplete={() => removePacket(pkt.id)}
              />
            ))}
            <div className={`absolute top-4 left-1/2 -translate-x-1/2 bg-gray-900 border ${status.colorClass} px-6 py-2 rounded-xl text-sm font-bold text-center transition-opacity duration-300 shadow-lg text-white`} style={{opacity: status.visible ? 1 : 0}}>
              {status.text}
            </div>
          </div>

          <div className="w-32 h-48 bg-gray-800 border-2 border-gray-600 rounded-xl flex flex-col items-center justify-center z-20 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            <span className="font-extrabold text-gray-300">DDR Memory</span>
            <span className="text-xs text-gray-500 mt-1">AXI4 Slave</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
   Chapter 3
===================================================================== */
function Chapter3AxiStream() {
  const [streamPackets, setStreamPackets] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const removePacket = useCallback((id) => {
    setStreamPackets(p => p.filter(pkt => pkt.id !== id));
  }, []);

  const runStream = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    for(let i=0; i<5; i++) {
      const isLast = (i === 4);
      const id = Date.now() + i;
      setStreamPackets(p => [...p, { id, index: i, isLast }]);
      await new Promise(r => setTimeout(r, 400));
    }
    await new Promise(r => setTimeout(r, 2000));
    setIsAnimating(false);
  };

  return (
    <div className="space-y-10 animate-[fadeIn_0.4s_ease-out]">
      <SectionHeader 
        chapter="Chapter 3. AMBA AXI-Stream Protocol"
        title="주소(Address)가 배제된 순수 데이터 파이프라인"
        subtitle="메모 주소 채널을 아예 없애고, TLAST로 패킷의 경계를 구분하는 고속 단방향 프로토콜"
      />

      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-bold text-[#191f28]">3.1 AXI-Stream 동작 시각화</h3>
            <p className="text-[14px] text-[#4e5968] mt-1">주소가 없는 대신 <span className="font-mono font-bold text-red-500">TLAST</span> 신호가 "패킷(프레임)의 끝"을 알려줍니다.</p>
          </div>
          <button onClick={runStream} disabled={isAnimating} className="bg-[#8b5cf6] hover:bg-purple-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all active:scale-95 shadow-md disabled:opacity-50">
            {isAnimating ? <Loader className="w-4 h-4 animate-spin"/> : <Play className="w-4 h-4" />} Stream 데이터 송신
          </button>
        </div>

        <div className="bg-[#f8f9fa] border border-[#e5e8eb] p-6 rounded-xl relative overflow-hidden h-[180px] flex items-center justify-between">
          <div className="w-28 h-28 bg-white border-[3px] border-[#3182f6] rounded-xl flex flex-col items-center justify-center z-10 shadow-sm relative">
            <span className="font-extrabold text-[#3182f6]">DMA</span>
            <span className="text-[10px] text-gray-500">(Master)</span>
          </div>
          
          <div className="flex-1 h-12 relative flex items-center justify-center overflow-hidden mx-2">
            <div className={`w-full h-full bg-[#3182f6] rounded border-y-4 border-[#1e40af] transition-opacity ${isAnimating ? 'opacity-100' : 'opacity-50'}`} 
                 style={{ backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%, rgba(255,255,255,.15) 75%, transparent 75%, transparent)', backgroundSize: '40px 40px', animation: isAnimating ? 'conveyorBelt 1s linear infinite reverse' : 'none' }}>
            </div>
            <style dangerouslySetInnerHTML={{__html: `@keyframes conveyorBelt { 0% { background-position: 0 0; } 100% { background-position: 40px 0; } }`}} />

            {streamPackets.map(pkt => (
              <AnimatedPacket key={pkt.id} packetType="stream" index={pkt.index} isLast={pkt.isLast} startLeft="-60px" targetTransform="translateX(600px)" duration={1800} onComplete={() => removePacket(pkt.id)}
                className={`top-2 ${pkt.isLast ? 'bg-red-600 border-2 border-red-300 z-30 scale-110' : 'bg-[#1e40af] border border-[#60a5fa]'}`}
              />
            ))}
          </div>

          <div className="w-28 h-28 bg-white border-[3px] border-[#8b5cf6] rounded-xl flex flex-col items-center justify-center z-10 shadow-sm relative">
            <span className="font-extrabold text-[#8b5cf6]">Target IP</span>
            <span className="text-[10px] text-gray-500">(Slave)</span>
          </div>
        </div>

        <h3 className="text-lg font-bold mt-10 mb-3 text-[#191f28]">3.2 핵심 신호선 (Interface Signals)</h3>
        <div className="overflow-x-auto border rounded-xl">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 border-b">
                <th className="p-3 font-bold w-32">Signal</th>
                <th className="p-3 font-bold w-20">Source</th>
                <th className="p-3 font-bold">Engineering Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-3 font-mono font-bold text-[#3182f6]">TDATA[(8n-1):0]</td>
                <td className="p-3">Master</td>
                <td className="p-3 text-gray-700">실제 페이로드(Payload) 데이터. <span className="text-xs bg-gray-100 px-1 rounded ml-1">※ TVALID/TREADY 핸드셰이크 시 전송됨</span></td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-mono font-bold text-red-500">TLAST</td>
                <td className="p-3">Master</td>
                <td className="p-3 text-gray-700"><strong>패킷의 경계(Boundary of a packet)</strong>를 지시합니다. 송신측은 패킷(예: 이미지 1줄)의 마지막 데이터와 함께 TLAST를 1로 올립니다. DMA(수신측)는 이를 감지하여 한 번의 처리를 종료하고 인터럽트를 겁니다.</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-mono font-bold text-purple-600">TUSER</td>
                <td className="p-3">Master</td>
                <td className="p-3 text-gray-700">사용자 정의 사이드밴드 신호. 비디오 데이터에서는 <strong>SOF(Start of Frame)</strong> 등의 신호로 주로 사용됩니다.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-8 bg-[#ecfdf5] p-5 rounded-xl border border-green-200">
          <h4 className="font-bold text-green-700 text-sm mb-2 flex items-center gap-1"><MonitorPlay className="w-4 h-4"/> 3.3 AXI4-Stream Video와 VDMA 특화</h4>
          <p className="text-[13px] text-gray-700 leading-relaxed mb-2">
            영상을 다루는 VDMA 환경에서 AXI-Stream 신호는 관례적으로 다음과 같은 구체적 의미를 가집니다. 일반 DMA를 쓸지 VDMA를 쓸지 구분하는 기준이 됩니다.
          </p>
          <ul className="list-disc pl-5 text-[12px] text-gray-600 space-y-1">
            <li><code className="text-red-500 bg-red-50 px-1">TLAST</code>: <strong>EOL (End of Line)</strong>. 영상 프레임의 한 줄이 끝났음을 의미.</li>
            <li><code className="text-purple-600 bg-purple-50 px-1">TUSER</code>: <strong>SOF (Start of Frame)</strong>. 전체 프레임의 첫 시작 픽셀임을 의미.</li>
            <li>VDMA 제어 시에는 총 바이트 수가 아닌 <strong>HSIZE</strong>(가로폭), <strong>VSIZE</strong>(세로줄 수), <strong>Stride</strong>(메모리 1줄 간격)를 설정합니다.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Chapter 4 (Scatter-Gather)
function Chapter4ScatterGather() {
  const [sgPhase, setSgPhase] = useState('IDLE'); 
  const isAnimating = sgPhase !== 'IDLE';

  const runSg = async () => {
    if (isAnimating) return;
    const wait = (ms) => new Promise(r => setTimeout(r, ms));
    
    setSgPhase('FETCH_0'); await wait(1500);
    setSgPhase('TRANS_0'); await wait(1500);
    setSgPhase('UPD_0');   await wait(1000);
    setSgPhase('DONE_0');  await wait(800);
    
    setSgPhase('FETCH_1'); await wait(1500);
    setSgPhase('TRANS_1'); await wait(1500);
    setSgPhase('UPD_1');   await wait(1000);
    setSgPhase('DONE_1');  await wait(800);
    
    setSgPhase('CHECK');   await wait(1500);
    setSgPhase('INT');     await wait(2000);
    
    setSgPhase('IDLE');
  };

  const getPointerState = () => {
    switch(sgPhase) {
      case 'FETCH_0': return { top: 40, icon: <Loader className="w-4 h-4 text-[#3182f6] animate-spin"/>, title: 'Phase 1: Fetch', desc: 'Reading BD0 from Memory...', color: 'text-[#3182f6]' };
      case 'TRANS_0': return { top: 40, icon: <ArrowRightLeft className="w-4 h-4 text-purple-500 animate-pulse"/>, title: 'Phase 2: Transfer', desc: 'Gathering Payload (4096B)', color: 'text-purple-500' };
      case 'UPD_0':   return { top: 40, icon: <Save className="w-4 h-4 text-amber-500 animate-pulse"/>, title: 'Phase 3: Update', desc: 'Writing Status to BD0', color: 'text-amber-500' };
      case 'DONE_0':  return { top: 40, icon: <Check className="w-4 h-4 text-green-500"/>, title: 'BD0 Complete', desc: 'Moving to next pointer', color: 'text-green-500' };
      
      case 'FETCH_1': return { top: 165, icon: <Loader className="w-4 h-4 text-[#3182f6] animate-spin"/>, title: 'Phase 1: Fetch', desc: 'Reading BD1 from Memory...', color: 'text-[#3182f6]' };
      case 'TRANS_1': return { top: 165, icon: <ArrowRightLeft className="w-4 h-4 text-pink-500 animate-pulse"/>, title: 'Phase 2: Transfer', desc: 'Gathering Payload (2048B)', color: 'text-pink-500' };
      case 'UPD_1':   return { top: 165, icon: <Save className="w-4 h-4 text-amber-500 animate-pulse"/>, title: 'Phase 3: Update', desc: 'Writing Status (EOF) to BD1', color: 'text-amber-500' };
      case 'DONE_1':  return { top: 165, icon: <Check className="w-4 h-4 text-green-500"/>, title: 'BD1 Complete', desc: 'Moving to next pointer', color: 'text-green-500' };
      
      case 'CHECK':   return { top: 290, icon: <AlertTriangle className="w-4 h-4 text-red-500 animate-bounce"/>, title: 'Phase 4: Check Tail', desc: 'NXTDESC == TAILDESC', color: 'text-red-500' };
      case 'INT':     return { top: 290, icon: <Zap className="w-4 h-4 text-green-500"/>, title: 'Interrupt Asserted', desc: 'Notifying CPU', color: 'text-green-500' };
      default: return { top: 40, opacity: 0 };
    }
  };
  const ptr = getPointerState();

  return (
    <div className="space-y-10 animate-[fadeIn_0.4s_ease-out]">
      <SectionHeader 
        chapter="Chapter 4. Advanced Execution Architecture"
        title="CPU의 역할과 Linked List의 진정한 의미"
        subtitle="CPU, AXI-Lite, AXI4 Full이 각자의 역할을 수행하여 가상 메모리의 파편화를 극복하는 핵심 메커니즘"
      />

      <div className="bg-[#fff7ed] p-8 rounded-2xl border border-orange-200 shadow-sm relative overflow-hidden mb-8">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-orange-50 rounded-full blur-3xl -z-10"></div>
        <h3 className="text-xl font-bold text-orange-600 mb-4 flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-orange-500" />
          가장 헷갈리는 질문: "BD(지시서)는 도대체 어떻게 미리 메모리에 들어가 있는 건가요?"
        </h3>
        <p className="text-[15px] text-gray-700 leading-relaxed mb-6">
          아주 예리한 질문입니다! BD가 마법처럼 원래부터 메모리에 있는 것이 절대 아닙니다. <br/><br/>
          DMA가 움직이기 <strong>'바로 직전'</strong>에, <strong>CPU(OS의 디바이스 드라이버 C/C++ 코드)가 직접 RAM에 변수를 만들고 값을 써넣는 것(Memory Write)</strong>입니다. 즉, CPU가 빈 종이(RAM)를 가져와서 펜으로 지시서를 한 땀 한 땀 작성한 뒤, 그 종이를 책상 위에 올려두는 과정이 반드시 선행됩니다.
        </p>

        <div className="bg-[#1e293b] rounded-xl p-5 shadow-inner overflow-hidden">
          <div className="flex items-center gap-2 mb-3 border-b border-gray-600 pb-2">
            <span className="text-xs font-mono text-gray-300">CPU Device Driver (Pseudo C Code)</span>
          </div>
          <pre className="font-mono text-[12px] md:text-[13px] text-green-400 leading-relaxed overflow-x-auto whitespace-pre-wrap break-words">
            <span className="text-gray-500">{"// 1. 메모리 공간 할당 (OS 차원에서 Cache Coherent 한 공간 할당 필수!)"}</span><br/>
            {"BD* bd0 = (BD*) dma_alloc_coherent(dev, sizeof(BD), &dma_handle0, GFP_KERNEL);"}<br/>
            {"BD* bd1 = (BD*) dma_alloc_coherent(dev, sizeof(BD), &dma_handle1, GFP_KERNEL);"}<br/>
            <br/>
            <span className="text-gray-500">{"// 2. CPU가 직접 RAM에 값을 기록 (작업 지시서 작성)"}</span><br/>
            {"bd0->NXTDESC  = dma_handle1;         "}<span className="text-gray-500">{"// 다음 지시서의 '물리 주소'"}</span><br/>
            {"bd0->BUF_ADDR = 0x80001000;          "}<span className="text-gray-500">{"// 여기서부터 4096바이트 퍼가"}</span><br/>
            {"bd0->LENGTH   = 4096;"}<br/>
            <br/>
            {"bd1->NXTDESC  = TAIL_ADDRESS;        "}<span className="text-gray-500">{"// 여기가 끝이야 (Tail)"}</span><br/>
            {"bd1->BUF_ADDR = 0x80002000;"}<br/>
            {"bd1->LENGTH   = 2048;"}<br/>
            <br/>
            <span className="text-gray-500">{"// 3. DMA에게 알림 (AXI-Lite) -> 가상 주소가 아닌 물리 주소를 넘겨야 함"}</span><br/>
            {"DMA_REG->CURDESC  = dma_handle0;     "}<span className="text-blue-300">{"// 첫 지시서는 이 위치에 있다!"}</span><br/>
            {"DMA_REG->TAILDESC = TAIL_ADDRESS;    "}<span className="text-red-400">{"// 끝 주소 기록 (DMA 하드웨어 가동! Trigger)"}</span>
          </pre>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-[#3182f6] shadow-sm relative overflow-hidden mt-8">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl -z-10"></div>
        <h3 className="text-xl font-bold text-[#191f28] mb-4 flex items-center gap-2">
          <Network className="w-6 h-6 text-[#3182f6]" />
          4.1 CPU와 DMA의 완벽한 분업 (티키타카 3단계)
        </h3>
        <p className="text-[15px] text-[#4e5968] mb-6 leading-relaxed">
          운영체제 환경에서 10MB짜리 파일을 전송하려 할 때, 이 데이터는 실제 물리적 RAM에 4KB 단위의 조각(Page)으로 뿔뿔이 흩어져(Scatter) 저장됩니다. 이를 전송하기 위해 <strong>CPU와 DMA가 어떻게 협력하는지 3단계</strong>로 살펴봅니다.
        </p>

        <div className="grid md:grid-cols-3 gap-4 relative z-10 mt-6">
          <div className="bg-[#f9fafb] p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col">
              <span className="bg-gray-800 text-white text-[10px] font-bold px-2 py-1 rounded self-start">Step 1. Software (CPU)</span>
              <h4 className="font-bold text-[#191f28] mt-3 mb-2 text-[14px]">작업 지시서 작성 (DDR RAM)</h4>
              <p className="text-[12.5px] text-gray-600 leading-relaxed">
                  CPU는 메모리 빈 공간에 <em>"0x8000 위치 4KB 전송 후, 0x1040 주소의 다음 지시서를 봐라"</em>와 같은 내용의 <strong>작업 지시서(BD) 수천 장을 Linked List로 작성</strong>해 둡니다.
              </p>
          </div>
          <div className="bg-[#f3e8ff] p-5 rounded-xl border border-purple-200 shadow-sm flex flex-col">
              <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded self-start">Step 2. AXI-Lite</span>
              <h4 className="font-bold text-purple-900 mt-3 mb-2 text-[14px]">CPU의 통보 (Register)</h4>
              <p className="text-[12.5px] text-purple-800 leading-relaxed">
                  지시서 묶음을 다 만들면, CPU는 AXI-Lite를 타고 DMA 레지스터에 한마디만 적습니다. <strong>"야 DMA, 메모리 0x1000 번지에 할 일(BD) 적어놨으니 일 시작해!"</strong> (CURDESC, TAILDESC 세팅)
              </p>
          </div>
          <div className="bg-[#eff7ff] p-5 rounded-xl border border-blue-200 shadow-sm flex flex-col">
              <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded self-start">Step 3. AXI4 Full</span>
              <h4 className="font-bold text-blue-900 mt-3 mb-2 text-[14px]">DMA의 독자적 수행 (Hardware)</h4>
              <p className="text-[12.5px] text-blue-800 leading-relaxed">
                  명령을 받은 DMA는 고속 버스인 AXI4 Full을 타고 0x1000 번지로 달려가 <strong>스스로 지시서를 읽고(Fetch), 진짜 데이터가 있는 위치로 가서 데이터를 쫙 퍼 나릅니다(Transfer).</strong>
              </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm overflow-hidden mt-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-bold text-[#191f28]">4.2 Scatter-Gather 메모리 매핑 시뮬레이션</h3>
            <p className="text-[13px] text-[#4e5968] mt-2 max-w-2xl">
              왼쪽의 <strong>지시서(BD) 링</strong>과 오른쪽의 <strong>실제 물리 데이터 블록(Data Chunk)</strong>의 관계에 주목하세요.<br/>
              DMA가 BD를 읽고(Fetch) &rarr; 해당 데이터를 전송(Transfer) &rarr; 상태를 기록(Update)하는 과정입니다.
            </p>
          </div>
          <button onClick={runSg} disabled={isAnimating} className="bg-[#3182f6] hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all active:scale-95 shadow-md mt-2 disabled:opacity-50">
            {isAnimating ? <Loader className="w-4 h-4 animate-spin"/> : <Play className="w-4 h-4" />} SG 리스트 실행
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 bg-[#f8f9fa] border border-[#e5e8eb] p-6 rounded-xl relative">
            <h4 className="text-xs font-bold text-gray-500 mb-6 tracking-wide text-center bg-gray-200 py-1 rounded">Memory: Buffer Descriptor Ring</h4>
            
            <div className="absolute left-[-20px] transition-all duration-700 ease-in-out z-20 flex items-center gap-3" style={{ top: ptr.top, opacity: ptr.opacity === 0 ? 0 : 1 }}>
               <div className="w-8 h-8 bg-white border-[3px] border-[#3182f6] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(49,130,246,0.5)] relative">
                 {ptr.icon}
                 <span className="absolute -top-6 bg-white px-1.5 rounded text-[9px] font-bold text-[#3182f6] shadow border border-blue-200 whitespace-nowrap">DMA Core</span>
               </div>
               {ptr.title && (
                 <div className="bg-white border border-gray-200 text-[#191f28] text-xs font-bold px-3 py-1.5 rounded-lg shadow-md flex flex-col gap-1 min-w-[150px]">
                   <span className={ptr.color}>{ptr.title}</span>
                   <span className="text-[10px] text-gray-500 font-mono">{ptr.desc}</span>
                 </div>
               )}
            </div>

            <div className="flex flex-col gap-6 relative ml-12">
              <div className={`transition-all duration-300 bg-white shadow-sm rounded-lg overflow-hidden border-2 ${['FETCH_0','TRANS_0'].includes(sgPhase) ? 'border-[#3182f6] shadow-[0_0_0_4px_rgba(49,130,246,0.2)] translate-x-2' : sgPhase === 'UPD_0' ? 'border-amber-500 shadow-[0_0_0_4px_rgba(245,158,11,0.2)] translate-x-2' : ['DONE_0','FETCH_1','TRANS_1','UPD_1','DONE_1','CHECK','INT'].includes(sgPhase) ? 'border-green-500 bg-green-50 opacity-80' : 'border-transparent'}`}>
                <div className="bg-blue-50 text-blue-800 text-xs font-bold px-3 py-2 flex justify-between items-center border-b border-blue-100">
                  <span>BD 0 (@0x1000)</span>
                  <span className="text-[9px] bg-[#3182f6] text-white px-1.5 py-0.5 rounded font-mono">CURDESC</span>
                </div>
                <div className="p-2 px-3 text-[11px] font-mono grid grid-cols-[70px_1fr] gap-1 border-b border-gray-100">
                  <span className="text-gray-400">NXTDESC:</span><span className="font-bold text-[#191f28]">0x1040</span>
                  <span className="text-gray-400">BUF_ADDR:</span><span className="font-bold text-[#191f28]">0x8000_1000</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 relative overflow-hidden">
                  <div className={`h-full bg-[#3182f6] transition-all ease-linear ${['TRANS_0','UPD_0','DONE_0','FETCH_1','TRANS_1','UPD_1','DONE_1','CHECK','INT'].includes(sgPhase) ? 'w-full duration-1500' : 'w-0 duration-0'}`}></div>
                </div>
                <div className="p-2 px-3 text-[11px] font-mono bg-gray-50 flex gap-2 items-center">
                  <span className="text-gray-400">STS:</span>
                  <span className={`italic ${['FETCH_0','TRANS_0'].includes(sgPhase)?'text-[#3182f6] font-bold':sgPhase==='UPD_0'?'text-amber-500 font-bold':['DONE_0','FETCH_1','TRANS_1','UPD_1','DONE_1','CHECK','INT'].includes(sgPhase)?'text-green-600 font-bold':'text-gray-500'}`}>
                    {sgPhase === 'IDLE' && 'Waiting'}
                    {sgPhase === 'FETCH_0' && 'Fetching...'}
                    {sgPhase === 'TRANS_0' && 'Transferring...'}
                    {sgPhase === 'UPD_0' && 'Updating...'}
                    {['DONE_0','FETCH_1','TRANS_1','UPD_1','DONE_1','CHECK','INT'].includes(sgPhase) && 'Complete'}
                  </span>
                </div>
              </div>

              <div className="w-px h-6 bg-gray-300 border-l-2 border-dashed border-gray-300 absolute left-8 top-[125px] z-0"></div>

              <div className={`transition-all duration-300 bg-white shadow-sm rounded-lg overflow-hidden border-2 ${['FETCH_1','TRANS_1'].includes(sgPhase) ? 'border-[#3182f6] shadow-[0_0_0_4px_rgba(49,130,246,0.2)] translate-x-2' : sgPhase === 'UPD_1' ? 'border-amber-500 shadow-[0_0_0_4px_rgba(245,158,11,0.2)] translate-x-2' : ['DONE_1','CHECK','INT'].includes(sgPhase) ? 'border-green-500 bg-green-50 opacity-80' : 'border-transparent'}`}>
                <div className="bg-gray-100 text-gray-700 text-xs font-bold px-3 py-2 border-b border-gray-200">
                  BD 1 (@0x1040)
                </div>
                <div className="p-2 px-3 text-[11px] font-mono grid grid-cols-[70px_1fr] gap-1 border-b border-gray-100">
                  <span className="text-gray-400">NXTDESC:</span><span className="font-bold text-[#191f28]">0x1080</span>
                  <span className="text-gray-400">BUF_ADDR:</span><span className="font-bold text-[#191f28]">0x8000_2000</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 relative overflow-hidden">
                  <div className={`h-full bg-[#3182f6] transition-all ease-linear ${['TRANS_1','UPD_1','DONE_1','CHECK','INT'].includes(sgPhase) ? 'w-full duration-1500' : 'w-0 duration-0'}`}></div>
                </div>
                <div className="p-2 px-3 text-[11px] font-mono bg-gray-50 flex gap-2 items-center">
                  <span className="text-gray-400">STS:</span>
                  <span className={`italic ${['FETCH_1','TRANS_1'].includes(sgPhase)?'text-[#3182f6] font-bold':sgPhase==='UPD_1'?'text-amber-500 font-bold':['DONE_1','CHECK','INT'].includes(sgPhase)?'text-green-600 font-bold':'text-gray-500'}`}>
                    {['IDLE','FETCH_0','TRANS_0','UPD_0','DONE_0'].includes(sgPhase) && 'Waiting'}
                    {sgPhase === 'FETCH_1' && 'Fetching...'}
                    {sgPhase === 'TRANS_1' && 'Transferring...'}
                    {sgPhase === 'UPD_1' && 'Updating (EOF)...'}
                    {['DONE_1','CHECK','INT'].includes(sgPhase) && 'Complete'}
                  </span>
                </div>
              </div>

              <div className="w-px h-6 bg-gray-300 border-l-2 border-dashed border-gray-300 absolute left-8 top-[250px] z-0"></div>

               <div className={`transition-all duration-300 bg-white border-dashed shadow-sm rounded-lg overflow-hidden border-2 ${['CHECK','INT'].includes(sgPhase) ? 'border-red-500 shadow-[0_0_0_4px_rgba(239,68,68,0.2)] translate-x-2 opacity-100' : 'border-gray-300 opacity-60'}`}>
                <div className="bg-gray-50 text-gray-500 text-xs font-bold px-3 py-2 border-b border-gray-200 flex justify-between items-center">
                  <span>BD 2 (@0x1080)</span>
                  <span className="text-[9px] bg-red-100 text-red-600 border border-red-200 px-1.5 py-0.5 rounded font-bold">TAILDESC</span>
                </div>
                <div className="p-3 text-center text-[10px] text-gray-500 font-bold leading-tight">
                  NXTDESC == TAILDESC 매칭 시,<br/> Interrupt 발생.
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-white border border-[#e5e8eb] p-6 rounded-xl relative shadow-inner">
             <h4 className="text-xs font-bold text-gray-500 mb-6 tracking-wide text-center">Physical Memory (Scattered Data)</h4>
             <div className="space-y-4">
               <div className={`transition-all duration-300 p-4 rounded-lg relative overflow-hidden border-2 border-dashed ${sgPhase === 'TRANS_0' ? 'border-purple-500 bg-purple-50' : ['UPD_0','DONE_0','FETCH_1','TRANS_1','UPD_1','DONE_1','CHECK','INT'].includes(sgPhase) ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50'}`}>
                 <div className="flex justify-between items-center mb-2 relative z-10">
                   <span className="font-mono text-[11px] text-purple-600 font-bold bg-purple-100 px-2 py-0.5 rounded">@0x8000_1000</span>
                   <span className="text-[10px] font-bold text-gray-500">4KB Block</span>
                 </div>
                 <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden relative z-10">
                   <div className={`h-full bg-purple-500 transition-all ease-linear ${['TRANS_0','UPD_0','DONE_0','FETCH_1','TRANS_1','UPD_1','DONE_1','CHECK','INT'].includes(sgPhase) ? 'w-full duration-1500' : 'w-0 duration-0'}`}></div>
                 </div>
               </div>
               
               <div className="text-center py-2">
                 <div className="w-1 h-1 bg-gray-300 rounded-full mx-auto my-1"></div>
                 <div className="w-1 h-1 bg-gray-300 rounded-full mx-auto my-1"></div>
               </div>

               <div className={`transition-all duration-300 p-4 rounded-lg relative overflow-hidden border-2 border-dashed ${sgPhase === 'TRANS_1' ? 'border-pink-500 bg-pink-50' : ['UPD_1','DONE_1','CHECK','INT'].includes(sgPhase) ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50'}`}>
                 <div className="flex justify-between items-center mb-2 relative z-10">
                   <span className="font-mono text-[11px] text-pink-600 font-bold bg-pink-100 px-2 py-0.5 rounded">@0x8000_2000</span>
                   <span className="text-[10px] font-bold text-gray-500">2KB Block (EOF)</span>
                 </div>
                 <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden relative z-10">
                   <div className={`h-full bg-pink-500 transition-all ease-linear ${['TRANS_1','UPD_1','DONE_1','CHECK','INT'].includes(sgPhase) ? 'w-full duration-1500' : 'w-0 duration-0'}`}></div>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Chapter 5
function Chapter5CsrMap() {
  const [hoverText, setHoverText] = useState('위의 비트(Bit) 블록에 마우스를 올려보세요.');

  const BitGroup = ({ label, bits, color, desc }) => (
    <div 
      className={`flex flex-col justify-center border-r border-gray-300 bit-group ${color}`}
      onMouseEnter={() => setHoverText(desc)}
      onMouseLeave={() => setHoverText('위의 비트(Bit) 블록에 마우스를 올려보세요.')}
      style={{flex: bits.includes('...') ? 1 : 'none', width: bits.includes('...') ? 'auto' : '80px'}}
    >
      <span className="text-gray-500 font-normal">{bits}</span>
      <span className="font-bold">{label}</span>
    </div>
  );

  return (
    <div className="space-y-10 animate-[fadeIn_0.4s_ease-out]">
      <SectionHeader 
        chapter="Chapter 5. Memory Mapped I/O"
        title="인터랙티브 CSR 레지스터 맵"
        subtitle="CPU가 DMA를 제어하기 위해 접근하는 AXI-Lite 레지스터. 비트 그룹에 마우스를 올려 기능을 확인하세요."
      />

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <h3 className="text-lg font-bold text-[#191f28] mb-4 border-l-4 border-[#3182f6] pl-3">DMACR (Control Register) @ 0x00</h3>
        <p className="text-sm text-gray-600 mb-4">DMA 채널의 동작을 지시하고 인터럽트 발생을 제어합니다.</p>
        
        <div className="flex border-2 border-gray-300 rounded-lg overflow-hidden h-14 mb-4 text-center text-[11px] font-mono cursor-pointer">
          <BitGroup bits="31 ... 15" label="RSVD" color="bg-gray-100 text-gray-400" desc="Reserved. 사용하지 않음." />
          <BitGroup bits="14" label="ErrIrqEn" color="bg-blue-50 text-blue-700" desc="14 (Err_IrqEn): 에러 발생 시 인터럽트 활성화" />
          <BitGroup bits="12" label="IOCIrqEn" color="bg-green-50 text-green-700" desc="12 (IOC_IrqEn): 모든 데이터 전송 완료 시 인터럽트(Interrupt on Complete) 활성화. 매우 중요!" />
          <BitGroup bits="11 ... 3" label="RSVD" color="bg-gray-100 text-gray-400" desc="Reserved. 사용하지 않음." />
          <BitGroup bits="2" label="Reset" color="bg-red-50 text-red-600" desc="2 (Reset): 1을 쓰면 DMA 채널을 Soft Reset 합니다." />
          <BitGroup bits="0" label="RS" color="bg-purple-50 text-purple-700" desc="0 (RS): Run/Stop. 1로 설정해야 DMA 엔진이 가동될 준비를 합니다." />
        </div>
        
        <div className="bg-[#191f28] text-white text-sm p-4 rounded-xl shadow-inner min-h-[60px] flex items-center justify-center font-bold transition-all">
          {hoverText}
        </div>

        <div className="h-px bg-gray-200 my-10"></div>

        <h3 className="text-lg font-bold text-[#191f28] mb-4 border-l-4 border-red-500 pl-3">DMASR (Status Register) @ 0x04</h3>
        <p className="text-sm text-gray-600 mb-4">CPU가 인터럽트를 받았을 때, 이 레지스터를 읽어(Read) DMA의 현재 상태를 확인합니다.</p>
        
        <div className="flex border-2 border-gray-300 rounded-lg overflow-hidden h-14 mb-4 text-center text-[11px] font-mono cursor-pointer">
          <BitGroup bits="31 ... 15" label="RSVD" color="bg-gray-100 text-gray-400" desc="Reserved. 사용하지 않음." />
          <BitGroup bits="14" label="ErrIrq" color="bg-blue-50 text-blue-700" desc="14 (Err_Irq): 에러 인터럽트가 발생했음을 알림 (W1C: 1을 쓰면 클리어 됨)" />
          <BitGroup bits="12" label="IOC_Irq" color="bg-green-50 text-green-700" desc="12 (IOC_Irq): 전송 완료 인터럽트가 발생했음을 알림. CPU는 ISR에서 1을 써서(W1C) 인터럽트를 해제해야 합니다." />
          <BitGroup bits="11 ... 4" label="Err Flags" color="bg-gray-100 text-gray-400" desc="내부 에러 상세 플래그 (Decode Error, Slave Error 등)" />
          <BitGroup bits="1" label="Idle" color="bg-yellow-50 text-yellow-700" desc="1 (Idle): 1이면 현재 수행 중인 데이터 전송이 없고 DMA가 쉬고 있음을 뜻함." />
          <BitGroup bits="0" label="Halted" color="bg-red-50 text-red-600" desc="0 (Halted): 1이면 DMA가 정지(Halt) 상태임을 뜻함." />
        </div>
      </div>
    </div>
  );
}

// Chapter 6 (TEA Pipeline)
function Chapter6TeaPipeline() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [packets, setPackets] = useState({ tx: [], rx: [] });
  const [coreState, setCoreState] = useState('IDLE'); 

  const runTea = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    for(let i=0; i<5; i++) {
      const id = Date.now() + i;
      
      setPackets(prev => ({ ...prev, tx: [...prev.tx, { id, text: `P${i}` }] }));
      
      setTimeout(() => {
        setPackets(prev => ({ ...prev, tx: prev.tx.filter(p => p.id !== id) }));
        setCoreState('ACTIVE');
        setTimeout(() => setCoreState('IDLE'), 200);

        setPackets(prev => ({ ...prev, rx: [...prev.rx, { id, text: `C${i}` }] }));
        
        setTimeout(() => {
          setPackets(prev => ({ ...prev, rx: prev.rx.filter(p => p.id !== id) }));
        }, 1200);

      }, 1200);

      await new Promise(r => setTimeout(r, 600));
    }

    await new Promise(r => setTimeout(r, 3000));
    setIsAnimating(false);
  };

  return (
    <div className="space-y-10 animate-[fadeIn_0.4s_ease-out]">
      <SectionHeader 
        chapter="Chapter 6. Real-world Pipeline"
        title="TEA 암호화 파이프라인 구동 시뮬레이션"
        subtitle="메모리의 평문(Plaintext)이 DMA를 타고 하드웨어 암호화 코어를 거쳐 암호문(Ciphertext)으로 저장되는 실전 사례"
      />

      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <p className="text-[14px] text-[#4e5968] max-w-2xl leading-relaxed">
            강의 자료(TEA Case Study)에 기반한 파이프라인입니다. <strong>TEA(Tiny Encryption Algorithm) 코어</strong>는 AXI-Stream 슬레이브로 데이터를 받아 64-bit 단위로 암호화 연산을 수행한 뒤, 다시 AXI-Stream 마스터를 통해 S2MM으로 내보냅니다.
          </p>
          <button onClick={runTea} disabled={isAnimating} className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all active:scale-95 shadow-md whitespace-nowrap mt-2 disabled:opacity-50">
            {isAnimating ? <Loader className="w-4 h-4 animate-spin"/> : <Lock className="w-4 h-4" />} 암호화 가동
          </button>
        </div>

        <div className="bg-[#191f28] p-6 rounded-xl border border-gray-800 flex items-center justify-between relative overflow-hidden h-[240px] shadow-inner">
          <div className="w-24 h-24 bg-gray-800 border border-gray-600 rounded flex flex-col items-center justify-center text-white z-10 shadow-lg">
            <FileText className="w-6 h-6 text-gray-400 mb-1" />
            <span className="text-[10px] font-bold text-center leading-tight">Plaintext<br/>Memory</span>
          </div>

          <div className="flex-1 h-12 relative flex items-center justify-center mx-2 z-0 overflow-hidden">
             <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 bg-gray-700"></div>
             <span className="absolute top-0 text-[9px] text-[#3182f6] font-bold">M_AXIS_MM2S</span>
             {packets.tx.map(pkt => (
                <AnimatedPacket key={pkt.id} packetType="tea" text={pkt.text} className="bg-[#3182f6] text-white" startLeft="-32px" targetTransform="translateX(300px)" duration={1200} onComplete={()=>{}} />
             ))}
          </div>

          <div className={`w-32 h-32 rounded-xl flex flex-col items-center justify-center text-white z-10 shadow-lg transition-all duration-300 border-2 ${coreState === 'ACTIVE' ? 'bg-red-500 border-red-600 scale-105 shadow-[0_0_20px_rgba(239,68,68,0.6)]' : 'bg-orange-400 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.4)]'}`}>
             <Lock className={`w-8 h-8 mb-1 ${coreState === 'ACTIVE' ? 'animate-pulse' : ''}`} />
             <span className="text-sm font-extrabold">TEA Core</span>
             <span className="text-[9px] bg-orange-500 px-1 rounded mt-1">Encrypting</span>
          </div>

          <div className="flex-1 h-12 relative flex items-center justify-center mx-2 z-0 overflow-hidden">
             <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 bg-gray-700"></div>
             <span className="absolute top-0 text-[9px] text-[#22c55e] font-bold">S_AXIS_S2MM</span>
             {packets.rx.map(pkt => (
                <AnimatedPacket key={pkt.id} packetType="tea" text={pkt.text} className="bg-red-500 text-white" startLeft="-32px" targetTransform="translateX(300px)" duration={1200} onComplete={()=>{}} />
             ))}
          </div>

          <div className="w-24 h-24 bg-gray-800 border border-gray-600 rounded flex flex-col items-center justify-center text-white z-10 shadow-lg">
            <FileKey2 className="w-6 h-6 text-red-400 mb-1" />
            <span className="text-[10px] font-bold text-center leading-tight">Ciphertext<br/>Memory</span>
          </div>
        </div>

        <div className="mt-6 bg-[#fff7ed] p-5 rounded-xl border border-orange-200">
          <h4 className="font-bold text-orange-600 text-sm mb-2 flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> 설계 시 핵심 포인트 (TLAST 재생성)</h4>
          <p className="text-[13px] text-gray-700 leading-relaxed">
            하드웨어 IP(TEA Core) 설계 시 가장 주의할 점은, <strong>입력받은 데이터의 TLAST 신호를 내부 연산 지연(Latency)만큼 쉬프트(Shift)시켜 출력 데이터가 나갈 때 정확히 M_TLAST를 재생성</strong>해주어야 한다는 것입니다. 이 타이밍이 어긋나면 수신부(S2MM) DMA가 영원히 완료 인터럽트를 띄우지 못해 시스템이 멈춥니다(Hang).
          </p>
        </div>
      </div>
    </div>
  );
}

// Chapter 7 (OS & Debugging)
function Chapter7AdvancedOS() {
  return (
    <div className="space-y-10 animate-[fadeIn_0.4s_ease-out]">
      <SectionHeader 
        chapter="Chapter 7. OS Integration & Debugging"
        title="실무 디버깅 & OS 레벨 고려사항"
        subtitle="RTL 코딩을 넘어 실제 Linux 환경에서 DMA 디바이스 드라이버를 개발할 때 반드시 알아야 할 시스템 레벨 지식과 체크리스트입니다."
      />

      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
        <h3 className="text-xl font-bold text-[#191f28] mb-4 flex items-center gap-2">
          <HardDrive className="w-6 h-6 text-[#3182f6]" />
          7.1 가상 주소(Virtual) vs 물리 주소(Physical)
        </h3>
        <p className="text-[14px] text-[#4e5968] mb-6 leading-relaxed">
          유저 스페이스 애플리케이션(예: C언어의 `malloc`으로 할당받은 포인터)은 <strong>가상 주소</strong>를 사용합니다. 하지만 AXI 버스에 물려있는 DMA 하드웨어는 OS의 가상 주소를 전혀 이해하지 못하며 오직 <strong>물리 주소(또는 DMA Bus Address)</strong>만 사용합니다.
        </p>
        <div className="bg-[#fff1f2] p-5 rounded-xl border border-red-200 mb-4">
          <h4 className="font-bold text-red-600 text-[13px] flex items-center gap-1 mb-1"><AlertTriangle className="w-4 h-4" /> 주의사항</h4>
          <p className="text-[13px] text-red-800">
            유저 애플리케이션의 포인터 값을 그대로 DMA 레지스터(`SOURCE/DEST` 혹은 `CURDESC`)에 밀어 넣으면 시스템 전체가 다운되거나 엉뚱한 메모리를 덮어써서 커널 패닉(Kernel Panic)이 발생합니다. 반드시 리눅스 커널의 DMA API(`dma_map_single` 또는 `dma_alloc_coherent`)를 통해 <strong>DMA 주소로 매핑</strong>한 값을 넘겨야 합니다. SMMU(IOMMU)가 있는 시스템에서는 이 변환을 하드웨어가 돕기도 합니다.
          </p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
        <h3 className="text-xl font-bold text-[#191f28] mb-4 flex items-center gap-2">
          <RefreshCcw className="w-6 h-6 text-purple-600" />
          7.2 캐시 일관성 (Cache Coherency)의 덫
        </h3>
        <p className="text-[14px] text-[#4e5968] mb-6 leading-relaxed">
          최신 CPU는 성능을 위해 DDR 메모리를 직접 읽지 않고 <strong>L1/L2 캐시(Cache)</strong>를 거칩니다. 반면, DMA는 보통 캐시 무시하고 <strong>DDR 메모리에 직접(Direct) 접근</strong>합니다. 여기서 치명적인 엇갈림이 발생합니다.
        </p>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="border border-purple-200 rounded-xl p-4 bg-purple-50">
            <h4 className="font-bold text-purple-900 text-[13px] mb-2 flex items-center gap-1">CPU <ArrowRightLeft className="w-3 h-3 mx-1"/> DMA 전송 시 (Cache Flush)</h4>
            <p className="text-[12px] text-purple-800">
              CPU가 보낼 데이터를 썼지만 아직 캐시에만 머물러 있고 DDR에는 반영되지 않았을 수 있습니다. 이때 DMA가 읽어가면 옛날 쓰레기 데이터(Stale Data)가 전송됩니다. <br/>
              &rarr; 해결: DMA 시작 전 반드시 <strong>Cache Flush (Clean)</strong>를 수행하여 캐시 내용을 DDR로 밀어내야 합니다.
            </p>
          </div>
          <div className="border border-indigo-200 rounded-xl p-4 bg-indigo-50">
            <h4 className="font-bold text-indigo-900 text-[13px] mb-2 flex items-center gap-1">DMA <ArrowRightLeft className="w-3 h-3 mx-1"/> CPU 수신 시 (Cache Invalidate)</h4>
            <p className="text-[12px] text-indigo-800">
              DMA가 새로운 데이터를 DDR에 썼는데, CPU가 읽으려고 하니 자신의 캐시에 예전 데이터가 남아있어 캐시 값을 그대로 읽어버립니다. <br/>
              &rarr; 해결: CPU가 데이터를 읽기 전에 반드시 <strong>Cache Invalidate</strong>를 수행하여 캐시를 날리고 DDR에서 새로 읽어오도록 강제해야 합니다.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
        <h3 className="text-xl font-bold text-[#191f28] mb-4 flex items-center gap-2">
          <ArrowRightLeft className="w-6 h-6 text-amber-500" />
          7.3 Backpressure와 Deadlock 방지
        </h3>
        <p className="text-[14px] text-[#4e5968] mb-4 leading-relaxed">
          AXI-Stream 통신 시 <code className="bg-gray-100 px-1 rounded text-red-500 text-xs">TVALID</code>와 <code className="bg-gray-100 px-1 rounded text-green-600 text-xs">TREADY</code>가 모두 1일 때만 데이터가 넘어갑니다. 만약 타겟 IP의 처리가 늦어져 `TREADY`를 0으로 내리면(<strong>Backpressure</strong>), DMA도 멈추어 기다려야 합니다.
        </p>
        <p className="text-[14px] text-[#4e5968] mb-4 leading-relaxed">
          만약 S2MM(수신) 쪽 버퍼가 꽉 차서 더 이상 받지 못하거나, 송신 측에서 실수로 <code className="bg-gray-100 px-1 rounded text-blue-600 text-xs">TLAST</code>를 영원히 내보내지 않으면, DMA는 무한정 대기하는 <strong>데드락(Deadlock)</strong> 상태에 빠집니다. 이를 방지하기 위해 스트림 경로 중간에 <strong>충분한 크기의 FIFO나 Skid Buffer</strong>를 두는 설계가 권장됩니다.
        </p>
      </div>

      <div className="bg-[#191f28] p-8 rounded-2xl border border-gray-800 shadow-sm">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <CheckSquare className="w-6 h-6 text-green-400" />
          7.4 흔한 실수 체크리스트 (디버깅)
        </h3>
        
        <div className="space-y-3">
          <label className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-xl border border-gray-700 cursor-pointer hover:bg-gray-700 transition">
            <input type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-500 text-blue-500 bg-gray-900" />
            <span className="text-sm text-gray-300"><strong className="text-white">올바른 IP를 골랐는가?</strong> 메모리 간 복사인데 AXI DMA를 쓰거나, 영상 프레임인데 VDMA 대신 일반 DMA를 쓰지 않았는지 확인하세요.</span>
          </label>
          <label className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-xl border border-gray-700 cursor-pointer hover:bg-gray-700 transition">
            <input type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-500 text-blue-500 bg-gray-900" />
            <span className="text-sm text-gray-300"><strong className="text-white">TLAST가 정확히 Assert 되는가?</strong> 타겟 IP가 패킷의 마지막에 TLAST를 1로 올리지 않으면, 수신 DMA(S2MM)는 영원히 완료 인터럽트를 띄우지 못하고 멈춥니다.</span>
          </label>
          <label className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-xl border border-gray-700 cursor-pointer hover:bg-gray-700 transition">
            <input type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-500 text-blue-500 bg-gray-900" />
            <span className="text-sm text-gray-300"><strong className="text-white">가상 주소를 그대로 넣지 않았는가?</strong> 리눅스 드라이버 작성 시, SOURCE/DEST 주소 레지스터에 포인터 값(Virtual Addr)이 아닌 <code>dma_addr_t</code> (Physical/DMA Addr)를 넣었는지 확인하세요.</span>
          </label>
          <label className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-xl border border-gray-700 cursor-pointer hover:bg-gray-700 transition">
            <input type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-500 text-blue-500 bg-gray-900" />
            <span className="text-sm text-gray-300"><strong className="text-white">캐시 동기화(Cache Flush/Invalidate)를 했는가?</strong> 데이터 전송 전후로 캐시를 제대로 비워주었는지, 혹은 DMA Coherent 메모리로 할당받았는지 확인하세요. SG 모드에서는 Descriptor 메모리 역시 캐시 동기화 대상입니다!</span>
          </label>
          <label className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-xl border border-gray-700 cursor-pointer hover:bg-gray-700 transition">
            <input type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-500 text-blue-500 bg-gray-900" />
            <span className="text-sm text-gray-300"><strong className="text-white">TVALID / TREADY가 올바르게 작동하는가?</strong> ILA(Integrated Logic Analyzer)로 파형을 찍어봤을 때 두 신호가 동시에 High일 때만 데이터가 넘어가고 있는지(핸드셰이크) 파악하세요.</span>
          </label>
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
   Main App
===================================================================== */
export default function App() {
  const [activeTab, setActiveTab] = useState('intro');

  const TABS = [
    { id: 'intro', label: '1. Big Picture' },
    { id: 'axi4', label: '2. Burst' },
    { id: 'axi', label: '3. Stream' },
    { id: 'sg', label: '4. SG 프로세스' },
    { id: 'csr', label: '5. CSR' },
    { id: 'case', label: '6. TEA 사례' },
    { id: 'os', label: '7. OS & 디버깅' }, 
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f2f4f6] text-[#191f28] font-sans selection:bg-[#3182f6] selection:text-white" style={{ fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif" }}>
      
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
      `}} />

      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#191f28] rounded-lg flex items-center justify-center text-white font-bold text-lg">A</div>
          <h1 className="text-xl font-bold text-[#191f28] tracking-tight truncate max-w-[200px] sm:max-w-none">AXI DMA Architecture Guide</h1>
        </div>
        
        <nav className="hidden lg:flex gap-1 bg-[#f2f4f6] p-1 rounded-xl">
          {TABS.map(tab => (
            <TabButton key={tab.id} active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} isMobile={false}>
              {tab.label}
            </TabButton>
          ))}
        </nav>
      </header>

      <div className="lg:hidden bg-white border-b border-gray-200 px-2 py-2 flex overflow-x-auto hide-scrollbar gap-2 sticky top-[68px] z-40 shadow-sm">
        {TABS.map(tab => (
          <TabButton key={tab.id} active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} isMobile={true}>
            {tab.label}
          </TabButton>
        ))}
      </div>

      <main className="max-w-5xl w-full mx-auto px-4 py-8 lg:py-10 flex-1">
        {activeTab === 'intro' && <Chapter1BigPicture />}
        {activeTab === 'axi4' && <Chapter2Axi4Burst />}
        {activeTab === 'axi' && <Chapter3AxiStream />}
        {activeTab === 'sg' && <Chapter4ScatterGather />}
        {activeTab === 'csr' && <Chapter5CsrMap />}
        {activeTab === 'case' && <Chapter6TeaPipeline />}
        {activeTab === 'os' && <Chapter7AdvancedOS />}
      </main>

      <footer className="mt-auto border-t border-gray-200 bg-[#f9fafb] py-8">
        <div className="max-w-5xl mx-auto px-4 text-center text-[#8b95a1] text-xs">
          <p>본 가이드북은 AXI 규격과 Scatter-Gather DMA 트랜잭션 아키텍처에 기반하여 작성되었습니다.</p>
          <p className="mt-1 font-mono">Includes Advanced OS Level Configurations and Debugging Checks.</p>
        </div>
      </footer>
    </div>
  );
}