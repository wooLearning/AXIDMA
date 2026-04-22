# AXI DMA 고도화 키워드 및 개념 정리

이 문서는 AXI DMA 자료를 고도화하기 위해 카톡 대화에서 나온 키워드와 관련 개념을 정리한 메모이다.
핵심 방향은 AXI DMA를 단순 전송 IP로만 설명하지 않고, CDMA, VDMA, Scatter-Gather, AXI4-Stream Video, OS 메모리, 캐시 일관성까지 연결해서 설명하는 것이다.

## 1. 핵심 키워드

### DMA/IP 종류

- `AXI DMA`
- `AXI CDMA`
- `AXI VDMA`
- `MCDMA`, `Multi-channel DMA`
- `Simple DMA`, `Direct Register Mode`
- `Scatter-Gather DMA`, `SG Mode`
- `Descriptor`, `Buffer Descriptor`, `BD`
- `LogiCORE`
- `PrimeCell`
- `AMBA`
- `AHB vs AXI`

### AXI 인터페이스

- `AXI4 Memory Mapped`
- `AXI4-Stream`
- `AXI4-Lite`
- `MM2S`
- `S2MM`
- `TVALID`
- `TREADY`
- `TDATA`
- `TKEEP`
- `TSTRB`
- `TLAST`
- `TUSER`

### 비디오/이미지 스트림

- `AXI4-Stream Video`
- `VDMA`
- `SOF`, `Start Of Frame`
- `EOL`, `End Of Line`
- `EOF`, `End Of Frame`
- `Frame Sync`
- `Frame Buffer`
- `Line stride`
- `HSIZE`
- `VSIZE`
- `Genlock`

### 설계/디버깅 이슈

- `Backpressure`
- `Output buffer`
- `FIFO`
- `Deadlock`
- `TLAST 누락`
- `SG 모드 오설정`
- `Descriptor fetch`
- `DDR descriptor`
- `Interrupt`
- `Tail descriptor`

### OS/시스템 레벨

- `Virtual memory`
- `Physical address`
- `DMA address`
- `DMA coherent memory`
- `Reserved memory`
- `Cache flush`
- `Cache invalidate`
- `Cache coherency`
- `ACE`
- `ACE-Lite`
- `CHI`, `Coherent Hub Interface`
- `SMMU`, `IOMMU`
- `False sharing`

## 2. DMA 종류 구분

| 구분 | 주요 용도 | 설명 포인트 |
| --- | --- | --- |
| `AXI DMA` | Memory ↔ AXI4-Stream | DDR/BRAM 같은 memory-mapped 영역과 stream 기반 가속기 IP 사이의 고속 전송 |
| `AXI CDMA` | Memory ↔ Memory | memory-mapped source address에서 memory-mapped destination address로 복사 |
| `AXI VDMA` | Video frame buffer ↔ AXI4-Stream Video | 이미지/영상 프레임, 라인, stride, frame buffer 관리에 특화 |
| `MCDMA` | Multi-channel stream DMA | 여러 AXI4-Stream 채널을 동시에 다루는 구조 |

### 설명 메모

- AHB에서 DMA를 배울 때는 `SRAM ↔ SRAM` 같은 memory-to-memory 전송이 자연스럽게 느껴질 수 있다.
- AMD/Xilinx의 `AXI DMA`는 일반적인 memory-to-memory DMA라기보다 `Memory ↔ AXI4-Stream peripheral` 전송에 가깝다.
- memory-to-memory 전송 관점에서는 `AXI CDMA`가 더 직접적인 비교 대상이다.
- 영상 처리나 프레임 버퍼가 들어오면 `AXI VDMA` 개념을 따로 설명해야 한다.

## 3. AXI DMA 기본 구조

### MM2S

`MM2S`는 `Memory Map to Stream`의 약자이다.

- 메모리에서 데이터를 읽는다.
- 읽은 데이터를 AXI4-Stream으로 내보낸다.
- 예: DDR에 있는 입력 데이터를 가속기 IP로 공급한다.

### S2MM

`S2MM`은 `Stream to Memory Map`의 약자이다.

- AXI4-Stream 입력 데이터를 받는다.
- 받은 데이터를 메모리에 쓴다.
- 예: 가속기 IP의 출력 stream을 DDR에 저장한다.

### AXI4-Lite

AXI4-Lite는 제어 레지스터 접근에 사용된다.

- DMA start/stop
- reset
- status 확인
- interrupt enable/clear
- source/destination address 설정
- transfer length 설정

### AXI4 Memory Mapped Master

실제 DDR/BRAM 같은 메모리 공간에 접근하는 경로이다.

- MM2S read master
- S2MM write master
- SG descriptor read/write 경로

### AXI4-Stream

가속기, 필터, 영상 처리 IP 같은 stream 기반 IP와 연결된다.

- `TVALID/TREADY` handshake가 핵심이다.
- `TLAST`를 통해 packet boundary 또는 line boundary를 전달한다.
- video stream에서는 `TUSER`가 frame boundary 의미를 가질 수 있다.

## 4. Simple Mode와 Scatter-Gather Mode

## Simple DMA, Direct Register Mode

Simple DMA는 CPU가 DMA 레지스터에 주소와 길이를 직접 설정해서 전송을 시작하는 방식이다.

일반적인 흐름:

1. DMA reset
2. source/destination address 설정
3. transfer length 설정
4. start bit 설정
5. 완료 interrupt 또는 status polling 확인

장점:

- 구조가 단순하다.
- 처음 실습하기 쉽다.
- descriptor 관리가 필요 없다.

단점:

- 전송마다 CPU 개입이 크다.
- 여러 buffer를 연속 처리하기 불편하다.
- 고성능 streaming pipeline에는 한계가 있다.

## Scatter-Gather Mode

Scatter-Gather 모드는 DMA가 메모리 안의 descriptor list를 직접 읽어서 전송을 수행하는 방식이다.

대화에서 나온 핵심 질문:

> SG는 작업 지시를 DDR에서 직접 읽어오는 것인가?

정리하면 그렇다. CPU는 descriptor chain을 메모리에 만들어두고, DMA는 그 descriptor를 읽어가며 전송을 진행한다.

Descriptor에 들어갈 수 있는 정보:

- 다음 descriptor 주소
- buffer 주소
- buffer length
- control bit
- status bit
- SOF/EOF 관련 bit
- interrupt on complete 설정

SG 모드의 장점:

- CPU 개입을 줄일 수 있다.
- 여러 buffer를 큐처럼 처리할 수 있다.
- 비연속 메모리 영역도 descriptor chain으로 연결할 수 있다.
- 고속 연속 전송에 유리하다.

SG 모드의 단점:

- descriptor 구조를 이해해야 한다.
- descriptor memory의 cache flush/invalidate가 중요해진다.
- tail descriptor, current descriptor, completion status 관리가 필요하다.
- simple mode처럼 레지스터 몇 개만 써서는 동작하지 않는다.

## 5. AXI4-Stream Video와 VDMA

대화에서 나온 중요한 포인트는 VDMA가 단순 AXI4-Stream DMA가 아니라 video timing을 강하게 의식한다는 점이다.

### 일반 AXI4-Stream

- `TLAST`는 보통 packet의 끝을 의미한다.
- packet의 의미는 사용자 설계에 따라 달라질 수 있다.
- stream 데이터의 모양을 DMA와 peripheral이 같은 방식으로 이해해야 한다.

### AXI4-Stream Video

AXI4-Stream Video에서는 관례적으로 다음처럼 해석된다.

- `TUSER`: `SOF`, Start Of Frame
- `TLAST`: `EOL`, End Of Line

즉, 일반적인 stream packet의 끝이 아니라 한 영상 라인의 끝을 `TLAST`로 표시하는 구조가 된다.

### VDMA에서 중요한 개념

- 프레임은 여러 line으로 구성된다.
- 각 line의 끝이 명확해야 한다.
- 한 frame의 시작 또는 끝을 명확히 추적해야 한다.
- frame buffer 주소와 stride가 맞아야 한다.
- `HSIZE`, `VSIZE`, `stride` 설정이 틀리면 영상이 깨지거나 DMA가 멈출 수 있다.

### 비유

모니터가 왼쪽 위에서 오른쪽으로 한 줄을 그리고, 다음 줄로 내려가며 전체 화면을 채우는 방식으로 생각하면 된다.

- 이 줄의 끝: `EOL`, 보통 `TLAST`
- 이 프레임의 시작: `SOF`, 보통 `TUSER`
- 전체 프레임 구성: line count, frame buffer, stride 설정으로 관리

## 6. Backpressure와 Deadlock

AXI4-Stream에서는 `TVALID`와 `TREADY`가 동시에 1일 때만 transfer가 성립한다.

문제가 되는 상황:

- downstream IP가 `TREADY`를 내리지 못한다.
- upstream IP가 `TVALID`를 유지한 채 막힌다.
- DMA가 `TLAST`를 기다리는데 stream 쪽에서 `TLAST`가 나오지 않는다.
- S2MM 쪽 buffer가 부족해서 write path가 막힌다.
- output buffer 없이 가속기 출력이 DMA나 memory write latency에 직접 묶인다.

대응:

- stream 경로에 FIFO 또는 skid buffer를 둔다.
- `TVALID`는 데이터가 유효할 때 유지한다.
- `TREADY` backpressure를 정상적으로 전파한다.
- `TLAST` 위치를 testbench에서 명확히 검증한다.
- S2MM completion 조건을 `TLAST`와 length 관점에서 모두 확인한다.

## 7. OS, Virtual Memory, Cache Coherency

DMA를 Linux/OS 환경에서 사용할 때는 RTL만 보는 것보다 시스템 메모리 관점이 더 중요해진다.

### Virtual address와 Physical address

CPU 프로그램은 보통 virtual address를 본다.
하지만 DMA IP는 실제 메모리 버스에서 동작하므로 physical address 또는 DMA address가 필요하다.

주의:

- user-space pointer를 그대로 DMA register에 넣으면 안 된다.
- Linux driver에서는 DMA mapping API를 사용해야 한다.
- reserved memory 또는 coherent buffer를 사용할 수 있다.

### Cache 문제

CPU는 cache를 통해 메모리를 읽고 쓴다.
DMA는 보통 DDR을 직접 읽고 쓴다.

문제 예시:

- CPU가 buffer에 데이터를 썼지만 아직 cache에만 있고 DDR에는 반영되지 않음
- DMA가 DDR에서 오래된 값을 읽음
- DMA가 DDR에 결과를 썼지만 CPU cache에는 이전 값이 남아 있음
- CPU가 결과 buffer를 읽었는데 stale data를 봄

대응:

- DMA 전송 전 `cache flush`
- DMA 수신 후 `cache invalidate`
- coherent DMA allocation 사용
- cacheable/non-cacheable memory 속성 확인
- descriptor memory도 cache 관리 대상인지 확인

## 8. CHI, ACE, SMMU로 확장되는 시스템 관점

DMA를 깊게 이해하려면 cache coherency와 memory translation까지 연결된다.

### ACE, ACE-Lite

- AXI 계열의 cache coherency 확장 개념이다.
- CPU cache와 IO/DMA master 사이의 일관성 문제를 시스템 인터커넥트 차원에서 다룬다.

### CHI

`CHI`는 `Coherent Hub Interface`이다.

- AMBA 5 계열의 coherency 인터페이스이다.
- 고성능 processor, accelerator, memory controller, interconnect가 coherent하게 동작하도록 연결하는 개념이다.
- 대규모 SoC, multi-core, accelerator 시스템에서 중요하다.

### SMMU, IOMMU

- DMA master가 사용하는 address를 변환하고 보호하는 장치이다.
- CPU의 MMU가 CPU virtual memory를 관리한다면, SMMU/IOMMU는 IO device의 memory access를 관리한다.
- 잘못된 DMA access를 제한하거나 virtualized environment에서 device를 안전하게 붙이는 데 중요하다.

## 9. False Sharing과 Cache 관점

대화에서 나온 `false sharing`은 DMA 자체보다 cache coherency를 이해하는 데 도움이 되는 개념이다.

False sharing:

- 서로 다른 CPU core가 서로 다른 데이터를 쓰고 있다.
- 하지만 그 데이터가 같은 cache line에 들어 있다.
- 한 core가 쓰면 다른 core의 cache line이 invalidation된다.
- 실제로는 같은 변수를 공유하지 않는데 cache line 단위 일관성 때문에 성능이 떨어진다.

DMA와 연결되는 포인트:

- cache coherency는 byte 단위가 아니라 cache line 단위로 동작하는 경우가 많다.
- DMA buffer 정렬과 cache line alignment가 중요하다.
- descriptor와 data buffer가 같은 cache line을 공유하면 예기치 않은 문제가 생길 수 있다.

## 10. 흔한 실수 체크리스트

### IP 선택 실수

- [ ] memory-to-memory 전송인데 AXI DMA를 먼저 고르지 않았는가?
- [ ] stream accelerator 연결인데 CDMA를 고르지 않았는가?
- [ ] video frame buffer 전송인데 VDMA 개념을 빼먹지 않았는가?

### AXI4-Stream 실수

- [ ] `TVALID/TREADY` handshake를 정확히 지켰는가?
- [ ] `TLAST`가 정확한 위치에서 한 cycle asserted되는가?
- [ ] S2MM 전송 완료 조건과 `TLAST` 관계를 확인했는가?
- [ ] backpressure 상황에서도 데이터가 유실되지 않는가?

### VDMA/Video 실수

- [ ] `TLAST`를 EOL로 해석해야 하는 구조인지 확인했는가?
- [ ] `TUSER`가 SOF로 들어가는지 확인했는가?
- [ ] `HSIZE`, `VSIZE`, `stride`가 frame buffer layout과 맞는가?
- [ ] line end와 frame boundary가 명확한가?

### SG 모드 실수

- [ ] SG 모드로 IP를 만들고 simple mode처럼 제어하고 있지 않은가?
- [ ] descriptor chain을 올바르게 구성했는가?
- [ ] current descriptor와 tail descriptor를 올바르게 설정했는가?
- [ ] descriptor memory cache flush/invalidate를 처리했는가?
- [ ] descriptor alignment 조건을 확인했는가?

### OS/Linux 실수

- [ ] virtual address를 DMA register에 직접 넣지 않았는가?
- [ ] physical/DMA address를 사용했는가?
- [ ] CPU가 쓴 buffer를 DMA가 읽기 전에 cache flush 했는가?
- [ ] DMA가 쓴 buffer를 CPU가 읽기 전에 cache invalidate 했는가?
- [ ] reserved memory 또는 coherent allocation 정책을 확인했는가?

## 11. 추천 문서 목차

AXI DMA 자료를 확장한다면 다음 목차가 자연스럽다.

1. DMA가 필요한 이유
2. AHB DMA vs AXI DMA 관점 차이
3. AXI DMA, CDMA, VDMA, MCDMA 종류 비교
4. AXI DMA 기본 구조: MM2S, S2MM, AXI-Lite, AXI4-MM, AXI4-Stream
5. Simple Mode 동작 순서
6. Scatter-Gather Mode와 Descriptor 구조
7. AXI4-Stream handshake와 TLAST 처리
8. VDMA와 AXI4-Stream Video: SOF, EOL, frame buffer, stride
9. Deadlock과 backpressure: FIFO/output buffer 설계
10. Linux/OS에서 DMA: physical address, cache coherency, reserved memory
11. CHI/ACE/SMMU로 보는 시스템 레벨 확장
12. 흔한 실수 체크리스트

## 12. 자료 개선용 프롬프트

아래 프롬프트를 그대로 사용해서 기존 AXI DMA 자료를 확장할 수 있다.

```text
AXI DMA 정리 자료를 고도화해줘.

다음 키워드를 반드시 반영해줘:
AXI DMA, AXI CDMA, AXI VDMA, MCDMA, Simple DMA, Scatter-Gather DMA, descriptor, MM2S, S2MM, AXI4-Lite, AXI4 Memory Mapped, AXI4-Stream, TVALID/TREADY, TLAST, TUSER, SOF, EOL, EOF, frame buffer, stride, HSIZE, VSIZE, backpressure, FIFO, deadlock, virtual memory, physical address, DMA coherent memory, cache flush/invalidate, SMMU/IOMMU, ACE, ACE-Lite, CHI, PrimeCell, LogiCORE.

특히 다음 차이를 명확히 설명해줘:
- AXI DMA는 memory ↔ AXI4-Stream peripheral 전송용
- AXI CDMA는 memory-mapped ↔ memory-mapped 전송용
- AXI VDMA는 video/frame buffer/line-based stream 전송용
- SG mode는 descriptor를 메모리에서 읽어오는 방식이며 simple register mode보다 설정이 복잡함
- AXI4-Stream Video에서는 TLAST가 보통 EOL, TUSER가 보통 SOF로 쓰임
- OS/Linux 환경에서는 virtual address, physical address, cache coherency 문제가 DMA 동작의 핵심 이슈임

초보자가 실수하기 쉬운 deadlock, TLAST 누락, SG 모드 오설정, cache flush/invalidate 누락도 체크리스트로 정리해줘.
```

## 13. 참고 링크

- [AMD AXI DMA LogiCORE IP Product Guide PG021](https://docs.amd.com/r/en-US/pg021_axi_dma/Introduction)
- [AMD AXI CDMA LogiCORE IP Product Guide PG034](https://docs.amd.com/r/en-US/pg034-axi-cdma)
- [AMD AXI VDMA LogiCORE IP Product Guide PG020](https://docs.amd.com/r/en-US/pg020_axi_vdma/Features)
- [AMD Video In to AXI4-Stream Product Guide PG043](https://docs.amd.com/r/en-US/pg043_v_vid_in_axi4s/Introduction)
- [Arm AMBA 5 and CHI overview](https://www.arm.com/architecture/system-architectures/amba/amba-5)

