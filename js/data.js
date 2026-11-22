/* ScaleLab course data — phần 1 */
window.SCALELAB = (function () {
  "use strict";

  const modules = [
    {
      id: "foundations",
      num: "01",
      title: "Nền tảng",
      tone: "blue",
      blurb: "Nhìn thấy một request đi qua từng lớp trước khi nghĩ đến chuyện mở rộng.",
      lessons: ["request-lifecycle", "latency-throughput"]
    },
    {
      id: "scaling",
      num: "02",
      title: "Mở rộng",
      tone: "coral",
      blurb: "Chia tải, cache và giữ dịch vụ đủ nhẹ để nhân bản.",
      lessons: ["load-balancing", "caching"]
    },
    {
      id: "data",
      num: "03",
      title: "Dữ liệu",
      tone: "green",
      blurb: "Chọn nơi lưu, sao chép và chia dữ liệu mà không mất ngủ.",
      lessons: ["sql-nosql", "replication", "sharding"]
    },
    {
      id: "async",
      num: "04",
      title: "Bất đồng bộ",
      tone: "violet",
      blurb: "Tách việc nặng ra khỏi đường đi trực tiếp của người dùng.",
      lessons: ["message-queue"]
    },
    {
      id: "systems",
      num: "05",
      title: "Hệ thống thật",
      tone: "yellow",
      blurb: "Ghép mọi mảnh lại thành hai sản phẩm quen thuộc.",
      lessons: ["url-shortener", "chat"]
    }
  ];

  const lessons = {
    "request-lifecycle": {
      id: "request-lifecycle",
      module: "foundations",
      title: "Một request đi đâu?",
      shortTitle: "Request lifecycle",
      subtitle: "Từ lúc gõ địa chỉ đến khi trang hiện ra, request đi qua DNS, load balancer, application server, cache và database. Mỗi chặng đều có thể là nơi mất thời gian.",
      blurb: "Bản đồ nền tảng của mọi hệ thống web, nhìn bằng mắt.",
      duration: "12 phút",
      level: "Nhập môn",
      tags: ["DNS", "HTTPS", "cache", "database"],
      metrics: [
        { key: "dns", label: "DNS", tone: "violet" },
        { key: "connect", label: "Kết nối", tone: "coral" },
        { key: "server", label: "Xử lý", tone: "blue" },
        { key: "total", label: "Tổng", tone: "green" }
      ],
      nodes: [
        { id: "browser", type: "client", x: 70, y: 350, w: 150, h: 74, label: "Trình duyệt", sub: "người dùng" },
        { id: "dns", type: "dns", x: 310, y: 80, w: 140, h: 64, label: "DNS", sub: "resolver" },
        { id: "lb", type: "lb", x: 300, y: 300, w: 150, h: 64, label: "Load balancer", sub: "cửa vào" },
        { id: "app", type: "server", x: 510, y: 350, w: 150, h: 66, label: "App server", sub: "xử lý request" },
        { id: "cache", type: "cache", x: 510, y: 100, w: 140, h: 64, label: "Cache", sub: "dữ liệu nóng" },
        { id: "db", type: "db", x: 735, y: 350, w: 130, h: 64, label: "Database", sub: "nguồn sự thật" }
      ],
      edges: [
        { id: "dns-ask", from: "browser", to: "dns", kind: "request", label: "ở đâu?", bow: -10 },
        { id: "dns-answer", from: "dns", to: "browser", kind: "response", label: "203.0.113.7", bow: 13 },
        { id: "connect", from: "browser", to: "lb", kind: "request", label: "HTTPS" },
        { id: "lb-app", from: "lb", to: "app", kind: "request" },
        { id: "cache-get", from: "app", to: "cache", kind: "request", label: "lookup", bow: 16 },
        { id: "cache-hit", from: "cache", to: "app", kind: "response", label: "hit", bow: -16 },
        { id: "db-get", from: "app", to: "db", kind: "request", label: "miss", bow: -15 },
        { id: "db-answer", from: "db", to: "app", kind: "response", label: "data", bow: 15 },
        { id: "render", from: "app", to: "browser", kind: "response", label: "HTML + assets" }
      ],
      learn: [
        "Kể được hành trình của một request từ trình duyệt đến database.",
        "Phân biệt thời gian DNS, bắt tay kết nối, xử lý và truyền dữ liệu.",
        "Biết cache nằm ở đâu và vì sao nó giảm tải database.",
        "Nhìn ra chặng nào đang chiếm nhiều thời gian nhất trong một trang."
      ],
      steps: [
        {
          short: "Tổng quan",
          type: "TỔNG QUAN",
          title: "Một cú click, nhiều chặng",
          body: "Khi bạn mở <code>shop.example</code>, trình duyệt không nói chuyện trực tiếp với database. Nó đi qua một chuỗi lớp: tìm địa chỉ, mở kết nối, gặp load balancer, được xử lý ở application server, rồi mới chạm tới dữ liệu.",
          focus: ["browser"],
          edges: ["connect"],
          metrics: { dns: "—", connect: "—", server: "—", total: "0 ms" },
          changes: ["Bắt đầu từ trình duyệt", "Mỗi lớp có một nhiệm vụ riêng"],
          note: "Đừng học thuộc sơ đồ. Hãy tự hỏi: ở chặng này, cái gì có thể chậm, lỗi hoặc quá tải?"
        },
        {
          short: "DNS",
          type: "KỸ THUẬT",
          title: "Hỏi đường: DNS",
          body: "Trình duyệt cần biết IP của <code>shop.example</code>. Nó hỏi DNS resolver; resolver trả về một địa chỉ IP. Nếu DNS chậm, <strong>mọi thứ phía sau đều chưa thể bắt đầu</strong>.",
          focus: ["browser", "dns"],
          edges: ["dns-ask", "dns-answer"],
          metrics: { dns: "20 ms", connect: "—", server: "—", total: "20 ms" },
          changes: ["+ DNS lookup", "Địa chỉ IP được trả về"],
          note: "DNS thường được cache ở trình duyệt, hệ điều hành và resolver. TTL quyết định bản ghi được giữ bao lâu."
        },
        {
          short: "Kết nối",
          type: "KỸ THUẬT",
          title: "Bắt tay và vào cửa",
          body: "Trình duyệt mở kết nối TCP/TLS tới load balancer. Load balancer chọn một application server còn khỏe. Đây là lúc <strong>độ trễ mạng và chứng chỉ TLS</strong> xuất hiện.",
          focus: ["browser", "lb", "app"],
          edges: ["connect", "lb-app"],
          metrics: { dns: "20 ms", connect: "30 ms", server: "—", total: "50 ms" },
          changes: ["+ TCP/TLS handshake", "+ Chọn server ở load balancer"],
          note: "TLS 1.3 và kết nối được tái sử dụng giúp giảm đáng kể chi phí bắt tay cho các request sau."
        },
        {
          short: "Cache hit",
          type: "KỸ THUẬT",
          title: "Cache có gì không?",
          body: "Application server kiểm tra cache trước khi gọi database. Nếu dữ liệu đã có, đó là <strong>cache hit</strong>: phản hồi nhanh, database không phải làm việc.",
          focus: ["app", "cache"],
          edges: ["cache-get", "cache-hit"],
          metrics: { dns: "20 ms", connect: "30 ms", server: "8 ms", total: "58 ms" },
          changes: ["+ Cache lookup", "Database chưa bị gọi"],
          note: "Cache không phải nguồn sự thật. Nó là bản sao có thời hạn; dữ liệu có thể cũ hơn database."
        },
        {
          short: "Cache miss",
          type: "CẢNH BÁO",
          tone: "warn",
          title: "Ra database",
          body: "Nếu cache không có, đó là <strong>cache miss</strong>. Application server truy vấn database, nhận dữ liệu rồi thường ghi lại vào cache để lần sau nhanh hơn.",
          focus: ["app", "db"],
          edges: ["db-get", "db-answer"],
          metrics: { dns: "20 ms", connect: "30 ms", server: "53 ms", total: "103 ms" },
          changes: ["+ Database query", "+ Ghi kết quả vào cache"],
          warn: ["db"],
          note: "Nếu hit rate thấp, database trở thành nút thắt. Hãy đo hit rate trước khi tăng kích thước cache."
        },
        {
          short: "Phản hồi",
          type: "KỸ THUẬT",
          title: "Trả về trình duyệt",
          body: "Server trả HTML, CSS, JavaScript và dữ liệu. Trình duyệt tải thêm tài nguyên, dựng layout, chạy JavaScript rồi mới vẽ ra màn hình. <strong>Request xong chưa có nghĩa là trang đã sẵn sàng.</strong>",
          focus: ["app", "browser"],
          edges: ["render"],
          metrics: { dns: "20 ms", connect: "30 ms", server: "53 ms", total: "140 ms" },
          changes: ["+ Truyền phản hồi", "+ Trình duyệt render và tải asset"],
          note: "Với trang nặng, thời gian render và tải ảnh có thể lớn hơn cả thời gian server xử lý."
        },
        {
          short: "Tóm tắt",
          type: "TÓM TẮT",
          tone: "final",
          title: "Nhìn lại bức tranh",
          body: "Một request là một chuỗi cộng dồn: DNS + kết nối + xếp hàng + xử lý + truy vấn + truyền dữ liệu. Tối ưu hệ thống là tìm đúng chặng đang chiếm phần lớn thời gian, chứ không phải tối ưu mọi thứ cùng lúc.",
          focus: "all",
          edges: "all",
          metrics: { dns: "20 ms", connect: "30 ms", server: "53 ms", total: "140 ms" },
          changes: ["Có thể cache ở nhiều lớp", "Mỗi chặng cần một chỉ số riêng"],
          note: "Bài tiếp theo: đo latency và throughput đúng cách, vì hai con số này không thay thế nhau."
        }
      ]
    },

    "latency-throughput": {
      id: "latency-throughput",
      module: "foundations",
      title: "Latency & throughput",
      shortTitle: "Latency / throughput",
      subtitle: "Một hệ thống có thể xử lý 10.000 request mỗi giây nhưng vẫn khiến người dùng khó chịu. Hai chỉ số latency và throughput đo hai điều khác nhau.",
      blurb: "Phân biệt thời gian chờ và số việc làm được mỗi giây.",
      duration: "10 phút",
      level: "Nhập môn",
      tags: ["latency", "throughput", "p95", "queue"],
      metrics: [
        { key: "rps", label: "Lưu lượng", tone: "blue" },
        { key: "p50", label: "p50", tone: "green" },
        { key: "p95", label: "p95", tone: "coral" },
        { key: "util", label: "Tải server", tone: "violet" }
      ],
      nodes: [
        { id: "users", type: "client", x: 60, y: 205, w: 130, h: 64, label: "Người dùng", sub: "request/s" },
        { id: "queue", type: "queue", x: 255, y: 205, w: 150, h: 64, label: "Hàng đợi", sub: "chờ xử lý" },
        { id: "s1", type: "server", x: 480, y: 85, w: 140, h: 64, label: "Server A", sub: "2.000 req/s" },
        { id: "s2", type: "server", x: 480, y: 300, w: 140, h: 64, label: "Server B", sub: "2.000 req/s" },
        { id: "result", type: "client", x: 700, y: 192, w: 140, h: 64, label: "Phản hồi", sub: "p50 / p95" }
      ],
      edges: [
        { id: "incoming", from: "users", to: "queue", kind: "request", label: "đến" },
        { id: "to-a", from: "queue", to: "s1", kind: "request" },
        { id: "to-b", from: "queue", to: "s2", kind: "request" },
        { id: "a-out", from: "s1", to: "result", kind: "response" },
        { id: "b-out", from: "s2", to: "result", kind: "response" }
      ],
      learn: [
        "Phân biệt latency và throughput bằng một ví dụ cụ thể.",
        "Giải thích vì sao hàng đợi làm latency tăng nhanh khi tải cao.",
        "Biết p95 hữu ích hơn average ở đâu.",
        "Chọn giữa tăng số server và giảm thời gian xử lý."
      ],
      steps: [
        {
          short: "Hai câu hỏi",
          type: "TỔNG QUAN",
          title: "Nhanh và nhiều là hai chuyện",
          body: "<strong>Latency</strong> là thời gian một request hoàn thành. <strong>Throughput</strong> là số request hoàn thành mỗi giây. Một hệ thống có thể throughput cao nhưng latency tệ nếu request phải xếp hàng quá lâu.",
          focus: ["users", "result"],
          edges: ["incoming", "a-out"],
          metrics: { rps: "1.000", p50: "80 ms", p95: "140 ms", util: "35%" },
          changes: ["1.000 request mỗi giây", "Server còn nhiều dư địa"],
          note: "Đừng tối ưu average nếu người dùng đang phàn nàn. Hãy nhìn phân bố đuôi: p95, p99."
        },
        {
          short: "Tải tăng",
          type: "KỸ THUẬT",
          title: "Tải tăng, hàng đợi bắt đầu dài",
          body: "Lưu lượng tăng lên 3.000 request/s, sát ngưỡng phục vụ. Server vẫn xử lý được nhưng thời gian chờ bắt đầu tăng. <strong>Utilization cao không có nghĩa là hệ thống khỏe.</strong>",
          focus: ["users", "queue", "s1", "s2"],
          edges: ["incoming", "to-a", "to-b"],
          metrics: { rps: "3.000", p50: "120 ms", p95: "380 ms", util: "75%" },
          changes: ["+ Lưu lượng", "+ Thời gian chờ trong hàng đợi"],
          note: "Ở mức 70–80% công suất, hàng đợi bắt đầu dao động mạnh. 100% không phải mục tiêu."
        },
        {
          short: "Quá tải",
          type: "CẢNH BÁO",
          tone: "warn",
          title: "Hàng đợi phình ra",
          body: "Khi lưu lượng vượt năng lực phục vụ, hàng đợi tăng theo cấp số cộng. Request mới phải chờ lâu hơn, người dùng bấm lại, tạo thêm tải. <strong>Vòng xoáy quá tải bắt đầu.</strong>",
          focus: ["queue", "s1", "s2"],
          edges: ["incoming", "to-a", "to-b"],
          metrics: { rps: "6.000", p50: "480 ms", p95: "2.400 ms", util: "100%" },
          warn: ["queue"],
          changes: ["Hàng đợi tăng liên tục", "p95 tăng nhanh hơn p50"],
          note: "Đây là lý do cần giới hạn tải, timeout, và cơ chế từ chối sớm thay vì nhận hết rồi sập."
        },
        {
          short: "Scale out",
          type: "KỸ THUẬT",
          title: "Thêm một server",
          body: "Thêm Server B để chia tải. Throughput tăng gấp đôi, hàng đợi được giải phóng. Nhưng cách này chỉ hiệu quả nếu ứng dụng <strong>stateless</strong> hoặc session được lưu ở nơi dùng chung.",
          focus: ["queue", "s1", "s2"],
          edges: ["to-a", "to-b", "a-out", "b-out"],
          metrics: { rps: "6.000", p50: "95 ms", p95: "180 ms", util: "75%" },
          changes: ["+ Server B", "Tải mỗi server giảm"],
          note: "Scale out cần load balancer, health check và một chiến lược session rõ ràng."
        },
        {
          short: "Đuôi dài",
          type: "CẢNH BÁO",
          tone: "warn",
          title: "Average che giấu nỗi đau",
          body: "p50 có thể đẹp trong khi 5% người dùng chờ rất lâu. Một truy vấn chậm, một dependency chập chờn hoặc một hot key có thể tạo ra <strong>đuôi latency</strong> dài.",
          focus: ["result", "s1", "s2"],
          edges: ["a-out", "b-out"],
          metrics: { rps: "6.000", p50: "95 ms", p95: "1.800 ms", util: "75%" },
          warn: ["s2"],
          changes: ["p50 giữ nguyên", "p95 tăng vọt"],
          note: "Hãy đo theo từng dependency và từng endpoint. Một p95 toàn hệ thống có thể che giấu endpoint tệ nhất."
        },
        {
          short: "Tóm tắt",
          type: "TÓM TẮT",
          tone: "final",
          title: "Mục tiêu là giữ hệ thống trong vùng an toàn",
          body: "Latency là trải nghiệm của một người; throughput là năng lực của cả hệ thống. Muốn cải thiện latency, giảm việc phải làm hoặc giảm thời gian chờ. Muốn tăng throughput, thêm năng lực song song hoặc xử lý bất đồng bộ.",
          focus: "all",
          edges: "all",
          metrics: { rps: "6.000", p50: "95 ms", p95: "180 ms", util: "75%" },
          changes: ["Giữ utilization dưới ngưỡng an toàn", "Theo dõi p95/p99 theo endpoint"],
          note: "Bài sau: load balancer giúp phân phối tải, nhưng không tự sửa một ứng dụng có trạng thái."
        }
      ]
    },

    "load-balancing": {
      id: "load-balancing",
      module: "scaling",
      title: "Cân bằng tải",
      shortTitle: "Load balancing",
      subtitle: "Một server không thể vừa khỏe vừa bất tử. Load balancer phân phối request, loại bỏ node lỗi và là cửa vào ổn định cho hệ thống.",
      blurb: "Chia việc đều hơn và loại node lỗi ra khỏi vòng phục vụ.",
      duration: "11 phút",
      level: "Cơ bản",
      tags: ["load balancer", "health check", "round robin", "stateless"],
      metrics: [
        { key: "rps", label: "Tổng RPS", tone: "blue" },
        { key: "per", label: "Mỗi server", tone: "violet" },
        { key: "failed", label: "Server lỗi", tone: "coral" },
        { key: "p95", label: "p95", tone: "green" }
      ],
      nodes: [
        { id: "clients", type: "client", x: 45, y: 218, w: 130, h: 64, label: "Client", sub: "nhiều kết nối" },
        { id: "lb", type: "lb", x: 245, y: 218, w: 150, h: 64, label: "Load balancer", sub: "một cửa vào" },
        { id: "a", type: "server", x: 475, y: 66, w: 140, h: 64, label: "App A", sub: "2.000 req/s" },
        { id: "b", type: "server", x: 475, y: 214, w: 140, h: 64, label: "App B", sub: "2.000 req/s" },
        { id: "c", type: "server", x: 475, y: 362, w: 140, h: 64, label: "App C", sub: "2.000 req/s" },
        { id: "db", type: "db", x: 720, y: 214, w: 130, h: 64, label: "Database", sub: "dùng chung" }
      ],
      edges: [
        { id: "in", from: "clients", to: "lb", kind: "request", label: "HTTPS" },
        { id: "to-a", from: "lb", to: "a", kind: "request" },
        { id: "to-b", from: "lb", to: "b", kind: "request" },
        { id: "to-c", from: "lb", to: "c", kind: "request" },
        { id: "a-db", from: "a", to: "db", kind: "request", bow: -7 },
        { id: "b-db", from: "b", to: "db", kind: "request" },
        { id: "c-db", from: "c", to: "db", kind: "request", bow: 7 }
      ],
      learn: [
        "Giải thích vai trò của load balancer trong một hệ thống nhiều server.",
        "Phân biệt round robin, least connections và health check.",
        "Hiểu vì sao ứng dụng có trạng thái gây khó cho scale out.",
        "Biết load balancer không giải quyết nút thắt database."
      ],
      steps: [
        {
          short: "Một cửa vào",
          type: "TỔNG QUAN",
          title: "Không để client tự chọn server",
          body: "Load balancer đứng trước các application server, nhận request và chọn một server phù hợp. Client chỉ cần biết một địa chỉ; việc thêm, bớt hoặc thay server diễn ra phía sau.",
          focus: ["clients", "lb", "a"],
          edges: ["in", "to-a"],
          metrics: { rps: "6.000", per: "2.000", failed: "0", p95: "90 ms" },
          changes: ["Một địa chỉ công khai", "Server có thể thay đổi phía sau"],
          note: "Load balancer cũng cần dự phòng. Nếu nó là một node duy nhất, nó trở thành single point of failure."
        },
        {
          short: "Round robin",
          type: "KỸ THUẬT",
          title: "Chia đều theo vòng",
          body: "Round robin lần lượt gửi request đến từng server. Cách này đơn giản và hiệu quả khi các request tương đối đồng đều. Với request nặng nhẹ khác nhau, <strong>least connections</strong> thường công bằng hơn.",
          focus: ["lb", "a", "b", "c"],
          edges: ["in", "to-a", "to-b", "to-c"],
          metrics: { rps: "6.000", per: "2.000", failed: "0", p95: "95 ms" },
          changes: ["Chia đều 6.000 RPS", "Mỗi server nhận 2.000 RPS"],
          note: "Không có thuật toán nào tốt nhất cho mọi tải. Hãy chọn theo phân bố thời gian xử lý của request."
        },
        {
          short: "Health check",
          type: "CẢNH BÁO",
          tone: "warn",
          title: "Loại server lỗi ra khỏi vòng",
          body: "Health check định kỳ gọi một endpoint nhẹ hoặc kiểm tra kết nối. Khi App B không phản hồi, load balancer ngừng gửi request tới đó và chỉ dùng A, C. Người dùng thấy chậm hơn một chút, không thấy lỗi hàng loạt.",
          focus: ["lb", "a", "c"],
          edges: ["to-a", "to-c", "a-db", "c-db"],
          metrics: { rps: "6.000", per: "3.000", failed: "1", p95: "130 ms" },
          warn: ["b"],
          changes: ["App B bị đánh dấu lỗi", "Tải dồn sang A và C"],
          note: "Health check phải kiểm tra đúng thứ cần thiết. Một endpoint chỉ trả 200 nhưng dependency đã chết vẫn có thể khiến node bị coi là khỏe."
        },
        {
          short: "Stateless",
          type: "KỸ THUẬT",
          title: "Đừng giữ session trên server",
          body: "Nếu mỗi request phải quay lại đúng server đã đăng nhập, việc thêm server trở nên khó và node lỗi làm mất phiên. Hãy đưa session ra ngoài (cookie ký, Redis, token) để server nào cũng phục vụ được.",
          focus: ["clients", "lb", "a", "b", "c"],
          edges: ["in", "to-a", "to-b", "to-c"],
          metrics: { rps: "6.000", per: "2.000", failed: "1", p95: "120 ms" },
          changes: ["Session dùng chung", "Request không phụ thuộc một server"],
          note: "Sticky session không xấu tuyệt đối, nhưng nó làm mất cân bằng tải và khiến failover phức tạp hơn."
        },
        {
          short: "Thêm node",
          type: "KỸ THUẬT",
          title: "Mở rộng ngang",
          body: "Khi ba server không đủ, thêm server thứ tư và để load balancer tự động đưa vào vòng. Năng lực tăng gần tuyến tính, miễn là database và các dependency dùng chung cũng chịu được.",
          focus: ["lb", "a", "b", "c"],
          edges: ["in", "to-a", "to-b", "to-c"],
          metrics: { rps: "6.000", per: "1.500", failed: "0", p95: "85 ms" },
          changes: ["+ Một app server", "Tải mỗi node giảm"],
          note: "Load balancer giỏi đến đâu cũng không cứu được database quá tải. Nút thắt tiếp theo thường nằm ở dữ liệu."
        },
        {
          short: "Tóm tắt",
          type: "TÓM TẮT",
          tone: "final",
          title: "Cân bằng tải là một phần của thiết kế",
          body: "Load balancer cung cấp cửa vào ổn định, phân phối request và loại node lỗi. Nhưng nó chỉ phát huy tác dụng khi ứng dụng stateless, health check đáng tin và các dependency phía sau không bị nghẽn.",
          focus: "all",
          edges: "all",
          metrics: { rps: "6.000", per: "1.500", failed: "0", p95: "85 ms" },
          changes: ["Có thể thay node mà không đổi DNS", "Cần theo dõi tải từng node"],
          note: "Tiếp theo: cache — lớp giúp giảm cả latency lẫn tải database."
        }
      ]
    },

    "caching": {
      id: "caching",
      module: "scaling",
      title: "Cache",
      shortTitle: "Cache",
      subtitle: "Cache đổi độ trễ lấy khả năng dữ liệu bị cũ. Hiểu hit rate, TTL và cách xử lý cache miss giúp bạn dùng nó mà không tạo ra lỗi khó tìm.",
      blurb: "Giảm tải database bằng một bản sao có thời hạn.",
      duration: "12 phút",
      level: "Cơ bản",
      tags: ["cache-hit", "TTL", "invalidation", "stampede"],
      metrics: [
        { key: "hit", label: "Hit rate", tone: "green" },
        { key: "dbload", label: "Tải DB", tone: "coral" },
        { key: "p95", label: "p95", tone: "blue" },
        { key: "ttl", label: "TTL", tone: "violet" }
      ],
      nodes: [
        { id: "client", type: "client", x: 65, y: 210, w: 130, h: 64, label: "Client", sub: "request" },
        { id: "app", type: "server", x: 265, y: 210, w: 140, h: 64, label: "App server", sub: "cache-aside" },
        { id: "cache", type: "cache", x: 485, y: 82, w: 140, h: 64, label: "Cache", sub: "Redis / local" },
        { id: "db", type: "db", x: 485, y: 348, w: 140, h: 64, label: "Database", sub: "nguồn sự thật" }
      ],
      edges: [
        { id: "in", from: "client", to: "app", kind: "request", label: "đọc" },
        { id: "lookup", from: "app", to: "cache", kind: "request", label: "lookup", bow: 15 },
        { id: "hit", from: "cache", to: "app", kind: "response", label: "hit", bow: -15 },
        { id: "miss", from: "app", to: "db", kind: "request", label: "miss", bow: -15 },
        { id: "fill", from: "db", to: "app", kind: "response", label: "data", bow: 15 }
      ],
      learn: [
        "Mô tả luồng cache-aside: lookup, hit, miss, fill.",
        "Tính tác động của hit rate lên tải database.",
        "Chọn TTL và chiến lược invalidation phù hợp.",
        "Nhận diện cache stampede và cách giảm thiểu."
      ],
      steps: [
        {
          short: "Bản sao",
          type: "TỔNG QUAN",
          title: "Cache là một bản sao có thời hạn",
          body: "Cache lưu kết quả đã tính hoặc dữ liệu đã đọc để lần sau không phải hỏi database. Nó không thay thế nguồn sự thật; nó chỉ giúp <strong>đa số request không phải chạm vào nguồn đó</strong>.",
          focus: ["client", "app", "cache"],
          edges: ["in", "lookup"],
          metrics: { hit: "0%", dbload: "6.000/s", p95: "45 ms", ttl: "60 s" },
          changes: ["Cache đứng giữa app và database", "Chưa có dữ liệu nóng"],
          note: "Bắt đầu bằng việc đo hit rate. Cache không có hit rate tốt chỉ thêm một chặng mạng và một nguồn lỗi."
        },
        {
          short: "Hit",
          type: "KỸ THUẬT",
          title: "Cache hit: trả lời trong vài mili-giây",
          body: "Khi key đã có trong cache, app trả kết quả ngay. Database không nhận request. Với hit rate 90%, tải database giảm từ 6.000 xuống còn khoảng 600 request/s.",
          focus: ["app", "cache"],
          edges: ["lookup", "hit"],
          metrics: { hit: "90%", dbload: "600/s", p95: "8 ms", ttl: "60 s" },
          changes: ["+ Cache hit", "Tải database giảm 10 lần"],
          note: "Hit rate là chỉ số quan trọng nhất của cache. Nhưng hit rate cao vẫn có thể đi kèm dữ liệu cũ nếu TTL quá dài."
        },
        {
          short: "Miss",
          type: "CẢNH BÁO",
          tone: "warn",
          title: "Cache miss: quay về nguồn",
          body: "Khi key chưa có hoặc đã hết hạn, app đọc database rồi ghi kết quả vào cache. Request này chậm hơn, nhưng các request sau sẽ nhanh. <strong>Cache miss không xấu; miss liên tục mới xấu.</strong>",
          focus: ["app", "db"],
          edges: ["miss", "fill"],
          metrics: { hit: "90%", dbload: "600/s", p95: "45 ms", ttl: "60 s" },
          warn: ["db"],
          changes: ["+ Database query", "+ Ghi lại vào cache"],
          note: "Khi ghi cache, hãy đặt TTL. Không có TTL nghĩa là dữ liệu có thể sống mãi với một giá trị sai."
        },
        {
          short: "TTL",
          type: "KỸ THUẬT",
          title: "TTL và invalidation",
          body: "TTL giới hạn thời gian một entry được xem là hợp lệ. Với dữ liệu ít thay đổi, TTL dài giúp hit rate cao. Với dữ liệu quan trọng, cần chủ động xóa cache khi ghi hoặc dùng phiên bản key.",
          focus: ["cache", "db"],
          edges: ["lookup", "hit", "miss", "fill"],
          metrics: { hit: "85%", dbload: "900/s", p95: "30 ms", ttl: "60 s" },
          changes: ["TTL ngắn hơn → dữ liệu mới hơn", "Hit rate giảm nhẹ"],
          note: "Không có chiến lược invalidation hoàn hảo. Hãy chọn theo mức độ chấp nhận dữ liệu cũ của sản phẩm."
        },
        {
          short: "Stampede",
          type: "CẢNH BÁO",
          tone: "warn",
          title: "Cache stampede",
          body: "Nếu một key nóng hết hạn và hàng nghìn request cùng miss, tất cả cùng đổ vào database. Đây là <strong>cache stampede</strong>. Cách giảm: jitter TTL, single-flight, khóa theo key hoặc refresh nền.",
          focus: ["app", "cache", "db"],
          edges: ["lookup", "miss", "fill"],
          metrics: { hit: "20%", dbload: "4.800/s", p95: "900 ms", ttl: "0 s" },
          warn: ["cache", "db"],
          changes: ["Nhiều key cùng hết hạn", "Database bị dồn request"],
          note: "Đừng để mọi entry hết hạn cùng một thời điểm. Thêm nhiễu ngẫu nhiên vào TTL là cách rẻ nhất để giảm stampede."
        },
        {
          short: "Tóm tắt",
          type: "TÓM TẮT",
          tone: "final",
          title: "Cache là một giao kèo",
          body: "Bạn đổi một chút dữ liệu cũ lấy latency thấp và tải database nhỏ hơn. Giao kèo đó chỉ tốt khi hit rate đủ cao, TTL phù hợp và có cách xử lý miss mà không làm sập nguồn dữ liệu.",
          focus: "all",
          edges: "all",
          metrics: { hit: "90%", dbload: "600/s", p95: "8 ms", ttl: "60 s" },
          changes: ["Cache trước, database sau", "Đo hit rate và p95 cùng lúc"],
          note: "Tiếp theo: chọn SQL hay NoSQL — câu trả lời phụ thuộc vào truy vấn, không phải vào mốt công nghệ."
        }
      ]
    },

    "sql-nosql": {
      id: "sql-nosql",
      module: "data",
      title: "SQL hay NoSQL?",
      shortTitle: "SQL / NoSQL",
      subtitle: "Không có cơ sở dữ liệu tốt nhất. Chỉ có cơ sở dữ liệu phù hợp với cách bạn truy vấn, mức nhất quán bạn cần và cách dữ liệu sẽ lớn lên.",
      blurb: "Chọn theo truy vấn và ràng buộc, không theo nhãn.",
      duration: "9 phút",
      level: "Cơ bản",
      tags: ["SQL", "NoSQL", "schema", "transactions"],
      metrics: [
        { key: "schema", label: "Schema", tone: "blue" },
        { key: "join", label: "JOIN", tone: "violet" },
        { key: "scale", label: "Mở rộng", tone: "coral" },
        { key: "consistency", label: "Nhất quán", tone: "green" }
      ],
      nodes: [
        { id: "service", type: "server", x: 55, y: 210, w: 140, h: 64, label: "Ứng dụng", sub: "truy vấn" },
        { id: "sql", type: "db", x: 300, y: 78, w: 160, h: 72, label: "SQL", sub: "bảng + quan hệ" },
        { id: "nosql", type: "db", x: 300, y: 338, w: 160, h: 72, label: "NoSQL", sub: "document / key-value" },
        { id: "analytics", type: "worker", x: 560, y: 78, w: 150, h: 64, label: "Báo cáo", sub: "JOIN, tổng hợp" },
        { id: "feed", type: "store", x: 560, y: 338, w: 150, h: 64, label: "Feed / log", sub: "ghi nhanh" }
      ],
      edges: [
        { id: "tx", from: "service", to: "sql", kind: "request", label: "giao dịch" },
        { id: "flex", from: "service", to: "nosql", kind: "request", label: "linh hoạt" },
        { id: "join", from: "sql", to: "analytics", kind: "data", label: "JOIN" },
        { id: "append", from: "nosql", to: "feed", kind: "data", label: "append" }
      ],
      learn: [
        "Nêu được thế mạnh thật của cơ sở dữ liệu quan hệ.",
        "Hiểu khi nào document store hoặc key-value hợp lý hơn.",
        "Chọn mô hình dữ liệu theo truy vấn chính.",
        "Nhận ra mô hình polyglot persistence và cái giá của nó."
      ],
      steps: [
        {
          short: "Không miễn phí",
          type: "TỔNG QUAN",
          title: "Mọi lựa chọn đều có cái giá",
          body: "SQL mạnh về ràng buộc, giao dịch và truy vấn quan hệ. NoSQL linh hoạt, dễ mở rộng ngang và phù hợp với một số mẫu truy cập. Chọn sai mô hình thường đắt hơn chọn sai nhà cung cấp.",
          focus: ["service", "sql", "nosql"],
          edges: ["tx", "flex"],
          metrics: { schema: "Cố định", join: "Mạnh", scale: "Dọc", consistency: "ACID" },
          changes: ["Hai mô hình khác nhau", "Cùng một ứng dụng có thể dùng cả hai"],
          note: "NoSQL không đồng nghĩa với nhanh hơn. Nó chỉ đổi một tập ràng buộc lấy một tập lợi ích khác."
        },
        {
          short: "SQL",
          type: "KỸ THUẬT",
          title: "SQL: ràng buộc là tính năng",
          body: "Schema rõ ràng giúp dữ liệu nhất quán. JOIN và giao dịch nhiều bước rất mạnh khi nghiệp vụ cần tính đúng đắn. Đổi lại, thay đổi schema và scale ngang phức tạp hơn.",
          focus: ["service", "sql", "analytics"],
          edges: ["tx", "join"],
          metrics: { schema: "Cố định", join: "Mạnh", scale: "Dọc", consistency: "ACID" },
          changes: ["Dữ liệu có quan hệ", "Transaction bảo vệ nghiệp vụ"],
          note: "Đừng chọn NoSQL chỉ vì dự đoán sẽ có triệu người dùng. Hãy xem dữ liệu và truy vấn thực tế trước."
        },
        {
          short: "NoSQL",
          type: "KỸ THUẬT",
          title: "NoSQL: linh hoạt theo mẫu truy cập",
          body: "Document store phù hợp khi dữ liệu được đọc theo cả khối, ví dụ một bài viết kèm bình luận. Key-value cực nhanh cho lookup đơn giản. Nhưng JOIN và giao dịch nhiều bảng thường phải tự xử lý ở tầng ứng dụng.",
          focus: ["service", "nosql", "feed"],
          edges: ["flex", "append"],
          metrics: { schema: "Linh hoạt", join: "Hạn chế", scale: "Ngang", consistency: "Eventual" },
          changes: ["Schema thay đổi theo document", "Mở rộng bằng cách thêm node"],
          note: "Nếu bạn phải JOIN rất nhiều trong ứng dụng, có thể bạn đã chọn sai mô hình hoặc sai khóa phân vùng."
        },
        {
          short: "Chọn theo truy vấn",
          type: "KỸ THUẬT",
          title: "Bắt đầu từ truy vấn, không từ logo",
          body: "Liệt kê những truy vấn quan trọng nhất, tần suất, kích thước dữ liệu và yêu cầu nhất quán. Nếu cần giao dịch tài chính, SQL thường là mặc định. Nếu cần ghi log/timeline với khối lượng lớn, NoSQL có thể hợp hơn.",
          focus: "all",
          edges: "all",
          metrics: { schema: "Theo nhu cầu", join: "Có thể kết hợp", scale: "Theo nhu cầu", consistency: "Theo nghiệp vụ" },
          changes: ["Có thể dùng polyglot persistence", "Mỗi store có một nhiệm vụ"],
          note: "Polyglot persistence tăng độ phức tạp vận hành. Chỉ dùng nhiều loại database khi lợi ích rõ ràng hơn chi phí."
        },
        {
          short: "Tóm tắt",
          type: "TÓM TẮT",
          tone: "final",
          title: "Chọn theo ràng buộc quan trọng nhất",
          body: "SQL giữ cho dữ liệu có cấu trúc và giao dịch đáng tin. NoSQL mở ra mô hình linh hoạt và mở rộng ngang. Quyết định đúng bắt đầu từ truy vấn, khối lượng và mức nhất quán — không phải từ xu hướng.",
          focus: "all",
          edges: "all",
          metrics: { schema: "Theo nhu cầu", join: "Có thể kết hợp", scale: "Theo nhu cầu", consistency: "Theo nghiệp vụ" },
          changes: ["Bắt đầu đơn giản", "Chỉ tách khi có lý do"],
          note: "Tiếp theo: khi một database không đủ, replication và sharding là hai câu trả lời khác nhau."
        }
      ]
    }
  };

  return { modules, lessons };
})();
