/* ScaleLab course data — phần 4: Kiến trúc phần mềm */
(function () {
  "use strict";

  const SL = window.SCALELAB;
  if (!SL) return;

  SL.modules.push({
    id: "architecture",
    num: "07",
    title: "Kiến trúc",
    tone: "mint",
    blurb: "Chọn ranh giới, hợp đồng và cách chịu lỗi trước khi hệ thống lớn dần.",
    lessons: ["monolith-service", "layered-core", "event-driven", "api-contract", "resilience", "adr-tech-debt"]
  });

  Object.assign(SL.lessons, {
    "monolith-service": {
      id: "monolith-service",
      module: "architecture",
      title: "Monolith hay microservices?",
      shortTitle: "Monolith → service",
      subtitle: "Monolith không phải lỗi thời và microservices không phải đích đến. Câu hỏi đúng là ranh giới nào cần độc lập, ai sở hữu dữ liệu và nhóm có đủ năng lực vận hành nhiều dịch vụ hay không.",
      blurb: "Chọn ranh giới triển khai theo nhu cầu thật, không theo mốt.",
      duration: "14 phút",
      level: "Trung cấp",
      tags: ["monolith", "microservices", "bounded context", "deploy"],
      metrics: [
        { key: "services", label: "Dịch vụ", tone: "blue" },
        { key: "deploys", label: "Lần deploy", tone: "green" },
        { key: "coupling", label: "Ghép nối", tone: "coral" },
        { key: "latency", label: "Độ trễ", tone: "violet" }
      ],
      nodes: [
        { id: "ui", type: "client", x: 40, y: 330, w: 160, h: 64, label: "Giao diện", sub: "web và mobile" },
        { id: "app", type: "server", x: 250, y: 330, w: 170, h: 64, label: "Ứng dụng", sub: "một tiến trình" },
        { id: "db", type: "db", x: 470, y: 330, w: 150, h: 64, label: "CSDL chung", sub: "một lược đồ" },
        { id: "api", type: "gateway", x: 250, y: 120, w: 170, h: 64, label: "API gateway", sub: "định tuyến" },
        { id: "order", type: "server", x: 650, y: 50, w: 150, h: 64, label: "Đơn hàng", sub: "dịch vụ" },
        { id: "pay", type: "server", x: 650, y: 190, w: 150, h: 64, label: "Thanh toán", sub: "dịch vụ" },
        { id: "stock", type: "server", x: 650, y: 330, w: 150, h: 64, label: "Kho", sub: "dịch vụ" }
      ],
      edges: [
        { id: "ui-app", from: "ui", to: "app", kind: "request", label: "gọi" },
        { id: "app-db", from: "app", to: "db", kind: "data", label: "đọc ghi" },
        { id: "ui-api", from: "ui", to: "api", kind: "request", label: "HTTPS" },
        { id: "api-order", from: "api", to: "order", kind: "request", label: "định tuyến" },
        { id: "api-pay", from: "api", to: "pay", kind: "request", label: "định tuyến" },
        { id: "api-stock", from: "api", to: "stock", kind: "request", label: "định tuyến" },
        { id: "order-stock", from: "order", to: "stock", kind: "request", label: "gọi nội bộ", bow: 12 }
      ],
      learn: [
        "Nêu được lợi ích và chi phí thật của monolith và microservices.",
        "Dùng bounded context để chọn ranh giới dịch vụ.",
        "Hiểu vì sao chia sẻ một CSDL làm mất tính độc lập.",
        "Biết lộ trình tách dần thay vì viết lại toàn bộ."
      ],
      steps: [
        {
          short: "Bắt đầu",
          type: "TỔNG QUAN",
          title: "Một khối, một lần deploy",
          body: "Trong monolith, giao diện, nghiệp vụ và dữ liệu nằm chung một ứng dụng, deploy cùng một artifact. Giao dịch trong cùng CSDL nên dễ đảm bảo nhất quán. Khi nhóm còn nhỏ và miền nghiệp vụ chưa rõ, đây là lựa chọn <strong>nhanh và rẻ nhất</strong>.",
          focus: ["ui", "app", "db"],
          edges: ["ui-app", "app-db"],
          metrics: { services: "1", deploys: "1", coupling: "cao", latency: "thấp" },
          changes: ["Một artifact cho toàn hệ thống", "Một giao dịch CSDL"],
          note: "Monolith tốt khi ranh giới bên trong rõ: module hóa mã nguồn, không cho phép truy cập chéo bừa bãi."
        },
        {
          short: "Ranh giới",
          type: "KỸ THUẬT",
          title: "Module hóa trước khi chia dịch vụ",
          body: "Ranh giới tốt đi theo <strong>bounded context</strong>: đơn hàng, thanh toán và kho có ngôn ngữ riêng, dữ liệu riêng và quy tắc riêng. Nếu ngay trong monolith ba phần vẫn gọi thẳng vào bảng của nhau, tách ra thành dịch vụ chỉ biến lời gọi hàm thành lời gọi mạng đắt hơn.",
          focus: ["app", "order", "pay", "stock"],
          edges: ["app-db"],
          metrics: { services: "1", deploys: "1", coupling: "đang giảm", latency: "thấp" },
          changes: ["Ba module nội bộ", "Bảng dữ liệu có chủ sở hữu"],
          note: "Kiểm tra bằng câu hỏi: xóa module này, module kia có phải sửa theo không? Nếu có, ranh giới đang sai."
        },
        {
          short: "Tách",
          type: "KIẾN TRÚC",
          title: "Tách theo nhu cầu, không theo sơ đồ đẹp",
          body: "Chỉ tách khi có lý do cụ thể: phần thanh toán cần tuân thủ chặt hơn, phần kho cần mở rộng theo mùa, hoặc nhóm tăng trưởng đến mức tranh chấp deploy. Mỗi dịch vụ sở hữu dữ liệu của mình; giao tiếp qua hợp đồng API hoặc sự kiện, không đọc chung bảng.",
          focus: ["ui", "api", "order", "pay", "stock"],
          edges: ["ui-api", "api-order", "api-pay", "api-stock", "order-stock"],
          metrics: { services: "3+", deploys: "độc lập", coupling: "thấp hơn", latency: "tăng nhẹ" },
          changes: ["Ba dịch vụ triển khai riêng", "Gọi mạng thay cho gọi hàm"],
          note: "Một dịch vụ quá nhỏ sẽ tạo ra nhiều cuộc gọi mạng và nhiều bảng điều khiển hơn giá trị nó mang lại."
        },
        {
          short: "Chi phí",
          type: "CẢNH BÁO",
          title: "Độ phức tạp không biến mất, nó chuyển chỗ",
          body: "Microservices đổi giao dịch CSDL lấy giao dịch phân tán, đổi một pipeline deploy lấy nhiều pipeline, đổi gỡ lỗi trong một tiến trình lấy truy vết qua nhiều dịch vụ. Nhóm phải có log tập trung, trace, đo lường và quy trình phát hành nghiêm túc trước khi tách.",
          focus: ["api", "order", "pay", "stock"],
          edges: "all",
          warn: ["order", "pay"],
          metrics: { services: "3+", deploys: "nhiều", coupling: "vận hành cao", latency: "cao hơn" },
          changes: ["Cần trace xuyên dịch vụ", "Sự cố lan theo lời gọi"],
          note: "Nếu chưa có người trực on-call và dashboard tin cậy, hãy dừng ở modular monolith thêm một thời gian."
        },
        {
          short: "Tóm tắt",
          type: "TÓM TẮT",
          tone: "final",
          title: "Kiến trúc là chuỗi quyết định có thể đảo ngược",
          body: "Bắt đầu bằng monolith gọn, ranh giới rõ. Tách dịch vụ khi nhu cầu thật xuất hiện và khi đội đã sẵn sàng vận hành. Mỗi lần tách phải trả lời: ai sở hữu dữ liệu, hợp đồng giao tiếp là gì, hỏng thì xử lý ra sao.",
          focus: "all",
          edges: "all",
          metrics: { services: "theo nhu cầu", deploys: "theo nhu cầu", coupling: "được kiểm soát", latency: "được đo" },
          changes: ["Có tiêu chí tách rõ ràng", "Có đường quay lại"],
          note: "Đừng tổ chức dịch vụ theo tầng kỹ thuật như giao diện, nghiệp vụ, dữ liệu. Hãy tổ chức theo miền nghiệp vụ."
        }
      ]
    },

    "layered-core": {
      id: "layered-core",
      module: "architecture",
      title: "Phân lớp và lõi độc lập",
      shortTitle: "Lớp & lõi",
      subtitle: "Kiến trúc phân lớp giúp đổi giao diện, CSDL hay dịch vụ ngoài mà không phải viết lại quy tắc nghiệp vụ. Điều kiện là chiều phụ thuộc chỉ được trỏ vào trong.",
      blurb: "Giữ quy tắc nghiệp vụ sạch khỏi framework và hạ tầng.",
      duration: "13 phút",
      level: "Trung cấp",
      tags: ["layered", "hexagonal", "dependency rule", "ports"],
      metrics: [
        { key: "layers", label: "Lớp", tone: "blue" },
        { key: "ports", label: "Cổng", tone: "mint" },
        { key: "deps", label: "Phụ thuộc ngược", tone: "coral" },
        { key: "tests", label: "Test lõi", tone: "green" }
      ],
      nodes: [
        { id: "ui", type: "client", x: 40, y: 200, w: 150, h: 64, label: "Giao diện", sub: "web, mobile" },
        { id: "ctrl", type: "gateway", x: 240, y: 200, w: 160, h: 64, label: "Bộ điều khiển", sub: "nhận request" },
        { id: "usecase", type: "server", x: 450, y: 200, w: 160, h: 64, label: "Ca sử dụng", sub: "điều phối" },
        { id: "domain", type: "build", x: 660, y: 200, w: 170, h: 64, label: "Lõi nghiệp vụ", sub: "quy tắc thuần" },
        { id: "repo", type: "file", x: 450, y: 380, w: 160, h: 64, label: "Cổng lưu trữ", sub: "giao diện trừu tượng" },
        { id: "db", type: "db", x: 660, y: 380, w: 160, h: 64, label: "CSDL", sub: "adapter" },
        { id: "ext", type: "router", x: 240, y: 380, w: 160, h: 64, label: "Dịch vụ ngoài", sub: "thanh toán, email" }
      ],
      edges: [
        { id: "ui-ctrl", from: "ui", to: "ctrl", kind: "request", label: "gọi" },
        { id: "ctrl-use", from: "ctrl", to: "usecase", kind: "request", label: "giao việc" },
        { id: "use-domain", from: "usecase", to: "domain", kind: "data", label: "dùng" },
        { id: "ctrl-repo", from: "usecase", to: "repo", kind: "data", label: "qua cổng", bow: 10 },
        { id: "repo-db", from: "repo", to: "db", kind: "data", label: "adapter" },
        { id: "ctrl-ext", from: "usecase", to: "ext", kind: "request", label: "cổng ra", bow: -10 },
        { id: "domain-repo", from: "domain", to: "repo", kind: "data", label: "không biết", optional: true }
      ],
      learn: [
        "Phân biệt lớp giao diện, ứng dụng, miền và hạ tầng.",
        "Áp dụng quy tắc phụ thuộc một chiều.",
        "Dùng ports and adapters để cô lập CSDL và dịch vụ ngoài.",
        "Viết test cho lõi mà không cần dựng CSDL."
      ],
      steps: [
        {
          short: "Các lớp",
          type: "TỔNG QUAN",
          title: "Mỗi lớp một trách nhiệm",
          body: "Giao diện hiển thị và thu nhận dữ liệu. Bộ điều khiển chuyển request thành lời gọi ca sử dụng. Ca sử dụng điều phối một quy trình nghiệp vụ. Lõi miền giữ quy tắc bất biến: đơn hàng phải có ít nhất một dòng, tổng tiền không âm. Hạ tầng nói chuyện với CSDL và dịch vụ ngoài.",
          focus: ["ui", "ctrl", "usecase", "domain"],
          edges: ["ui-ctrl", "ctrl-use", "use-domain"],
          metrics: { layers: "4", ports: "0", deps: "0", tests: "ít" },
          changes: ["Trách nhiệm tách bạch", "Lõi chưa phụ thuộc hạ tầng"],
          note: "Đừng để controller chứa quy tắc tính giá. Hôm sau thêm kênh mobile, quy tắc sẽ bị chép đôi."
        },
        {
          short: "Quy tắc",
          type: "KỸ THUẬT",
          title: "Phụ thuộc chỉ trỏ vào trong",
          body: "Lớp ngoài được biết lớp trong, không chiều ngược lại. Lõi miền không import framework, không đọc biến môi trường, không gọi HTTP. Khi cần CSDL hay dịch vụ ngoài, lõi khai báo một <strong>cổng</strong> và hạ tầng cung cấp adapter.",
          focus: ["domain", "repo", "db", "ext"],
          edges: ["repo-db", "ctrl-repo"],
          metrics: { layers: "4", ports: "1", deps: "0", tests: "nhanh" },
          changes: ["Cổng lưu trữ ra đời", "CSDL nằm ngoài lõi"],
          note: "Cách kiểm tra rẻ nhất: chạy test lõi khi tắt mạng và CSDL. Nếu vẫn xanh, ranh giới đang đúng."
        },
        {
          short: "Adapter",
          type: "KIẾN TRÚC",
          title: "Đổi hạ tầng bằng cách thay adapter",
          body: "Cùng một cổng lưu trữ có thể có adapter PostgreSQL, adapter bộ nhớ cho test, adapter đọc từ dịch vụ cũ trong giai đoạn chuyển đổi. Lõi không biết sự khác biệt. Đây là lợi ích lớn nhất của hexagonal: <strong>hạ tầng trở thành chi tiết thay thế được</strong>.",
          focus: ["usecase", "repo", "db", "ext"],
          edges: ["ctrl-repo", "repo-db", "ctrl-ext"],
          metrics: { layers: "4", ports: "2", deps: "0", tests: "đầy đủ" },
          changes: ["Adapter thay được", "Dịch vụ ngoài bọc sau cổng"],
          note: "Không cần tạo cổng cho mọi thứ. Chỉ tạo ở nơi thật sự có biến động hoặc cần cô lập test."
        },
        {
          short: "Sai lệch",
          type: "CẢNH BÁO",
          title: "Khi lớp chỉ là thư mục",
          body: "Nhiều dự án có đủ thư mục controller, service, repository nhưng service gọi thẳng SQL, domain import ORM và controller tự tính giá. Đó là phân lớp hình thức. Quy tắc phụ thuộc chỉ có giá trị khi được kiểm tra tự động, ví dụ bằng test kiến trúc hoặc rà soát import.",
          focus: ["ctrl", "usecase", "domain", "repo"],
          edges: ["domain-repo"],
          warn: ["domain"],
          metrics: { layers: "4", ports: "1", deps: "3", tests: "giòn" },
          changes: ["Phát hiện phụ thuộc ngược", "Test bị ràng buộc CSDL"],
          note: "Thêm một test khẳng định gói domain không import gói hạ tầng. Rẻ và bắt lỗi rất sớm."
        },
        {
          short: "Tóm tắt",
          type: "TÓM TẮT",
          tone: "final",
          title: "Lõi sạch, biên linh hoạt",
          body: "Phân lớp có ích khi quy tắc nghiệp vụ sống lâu hơn framework. Giữ lõi không phụ thuộc hạ tầng, đặt cổng ở nơi cần thay thế, viết adapter mỏng và kiểm tra chiều phụ thuộc tự động. Đổi giao diện hay CSDL trở thành việc thay lớp biên.",
          focus: "all",
          edges: "all",
          metrics: { layers: "4", ports: "2", deps: "0", tests: "nhanh" },
          changes: ["Ranh giới được kiểm tra", "Hạ tầng thay được"],
          note: "Kiến trúc tốt không phải nhiều lớp nhất, mà là lớp nào cũng có lý do tồn tại và chiều phụ thuộc rõ ràng."
        }
      ]
    },

    "event-driven": {
      id: "event-driven",
      module: "architecture",
      title: "Hướng sự kiện và nhất quán sau",
      shortTitle: "Sự kiện",
      subtitle: "Gửi sự kiện giúp tách dịch vụ và xử lý việc nặng ngoài đường đi người dùng. Cái giá là trùng lặp, thứ tự và độ trễ: hệ thống phải chấp nhận nhất quán sau một khoảng thời gian.",
      blurb: "Tách bằng sự kiện, nhưng thiết kế cho trùng lặp và trễ.",
      duration: "14 phút",
      level: "Trung cấp",
      tags: ["event", "outbox", "idempotency", "saga"],
      metrics: [
        { key: "events", label: "Sự kiện", tone: "violet" },
        { key: "lag", label: "Độ trễ", tone: "coral" },
        { key: "dupes", label: "Trùng lặp", tone: "yellow" },
        { key: "state", label: "Nhất quán", tone: "green" }
      ],
      nodes: [
        { id: "order", type: "server", x: 60, y: 210, w: 160, h: 64, label: "Dịch vụ đơn", sub: "tạo đơn" },
        { id: "outbox", type: "file", x: 280, y: 210, w: 160, h: 64, label: "Bảng outbox", sub: "ghi cùng giao dịch" },
        { id: "broker", type: "queue", x: 500, y: 210, w: 150, h: 64, label: "Hàng đợi", sub: "sự kiện" },
        { id: "mail", type: "worker", x: 710, y: 70, w: 150, h: 64, label: "Gửi thư", sub: "consumer" },
        { id: "stock", type: "worker", x: 710, y: 210, w: 150, h: 64, label: "Giữ tồn", sub: "consumer" },
        { id: "report", type: "worker", x: 710, y: 350, w: 150, h: 64, label: "Báo cáo", sub: "consumer" },
        { id: "monitor", type: "monitor", x: 280, y: 380, w: 160, h: 64, label: "Giám sát lag", sub: "độ trễ hàng đợi" }
      ],
      edges: [
        { id: "order-outbox", from: "order", to: "outbox", kind: "data", label: "cùng commit" },
        { id: "outbox-broker", from: "outbox", to: "broker", kind: "data", label: "publish" },
        { id: "broker-mail", from: "broker", to: "mail", kind: "data", label: "fan-out" },
        { id: "broker-stock", from: "broker", to: "stock", kind: "data", label: "fan-out" },
        { id: "broker-report", from: "broker", to: "report", kind: "data", label: "fan-out" },
        { id: "broker-monitor", from: "broker", to: "monitor", kind: "data", label: "đo" }
      ],
      learn: [
        "Phân biệt gọi đồng bộ và giao tiếp bằng sự kiện.",
        "Dùng outbox để không mất sự kiện giữa CSDL và broker.",
        "Thiết kế consumer idempotent chịu được gửi lặp.",
        "Hiểu nhất quán sau và saga bù trừ."
      ],
      steps: [
        {
          short: "Đồng bộ",
          type: "TỔNG QUAN",
          title: "Gọi trực tiếp giữ mọi thứ trong một nhịp",
          body: "Khi đơn hàng gọi thẳng thư, kho và báo cáo, người dùng phải chờ cả ba. Một dịch vụ chậm làm toàn bộ chậm; một dịch vụ chết làm đơn thất bại. Đổi lại, mọi thứ xảy ra tức thì và dễ suy luận. Sự kiện đổi sự tức thì lấy khả năng tách và chịu lỗi.",
          focus: ["order", "mail", "stock", "report"],
          edges: "all",
          metrics: { events: "0", lag: "0 ms", dupes: "0", state: "tức thì" },
          changes: ["Đường đi dài theo số dịch vụ", "Một chỗ hỏng chặn tất cả"],
          note: "Không cần sự kiện chỉ vì nó nghe hiện đại. Nếu quy trình ngắn và cần kết quả ngay, gọi đồng bộ dễ đúng hơn."
        },
        {
          short: "Outbox",
          type: "KỸ THUẬT",
          title: "Ghi dữ liệu và sự kiện trong cùng giao dịch",
          body: "Nếu lưu đơn rồi mới publish, tiến trình có thể chết giữa hai bước và sự kiện mất. Outbox ghi sự kiện vào bảng cùng giao dịch với đơn; một bộ đọc riêng chuyển outbox sang broker. Ít nhất một lần, không bao giờ mất.",
          focus: ["order", "outbox", "broker"],
          edges: ["order-outbox", "outbox-broker"],
          metrics: { events: "1", lag: "vài ms", dupes: "có thể", state: "sau" },
          changes: ["Sự kiện không mất", "Có thể gửi lặp"],
          note: "Bảng outbox cần chỉ mục theo trạng thái và dọn dẹp định kỳ, nếu không sẽ phình rất nhanh."
        },
        {
          short: "Idempotent",
          type: "KỸ THUẬT",
          title: "Gửi lặp là bình thường",
          body: "Broker thường đảm bảo ít nhất một lần, nên consumer phải chịu được cùng một sự kiện đến hai lần. Dùng khóa nghiệp vụ như mã đơn kèm bảng đã xử lý, hoặc thao tác có tính idempotent như đặt trạng thái thay vì cộng dồn. <strong>Đừng giả định chỉ có một lần gửi.</strong>",
          focus: ["broker", "mail", "stock"],
          edges: ["broker-mail", "broker-stock"],
          metrics: { events: "nhiều", lag: "thấp", dupes: "bị chặn", state: "ổn định" },
          changes: ["Khóa chống trùng", "Thao tác đặt trạng thái"],
          note: "Ghi log mã sự kiện đã xử lý trong cùng giao dịch với thay đổi nghiệp vụ. Đừng dùng bộ nhớ tạm."
        },
        {
          short: "Saga",
          type: "KIẾN TRÚC",
          title: "Không có giao dịch phân tán miễn phí",
          body: "Đơn đã tạo nhưng giữ tồn thất bại: không thể rollback bằng một lệnh CSDL. Saga chia quy trình thành các bước có hành động bù: nhả tồn, hủy đơn, hoàn tiền. Trạng thái trung gian phải nhìn thấy được và có người hoặc tiến trình xử lý khi bù trừ cũng lỗi.",
          focus: ["order", "stock", "report"],
          edges: ["broker-stock", "broker-report"],
          warn: ["order", "stock"],
          metrics: { events: "chuỗi", lag: "vài giây", dupes: "bị chặn", state: "sau" },
          changes: ["Bước bù được định nghĩa", "Trạng thái treo được cảnh báo"],
          note: "Đặt hạn cho trạng thái treo. Một đơn kẹt mãi ở bước giữ tồn tệ hơn một đơn bị hủy rõ ràng."
        },
        {
          short: "Tóm tắt",
          type: "TÓM TẮT",
          tone: "final",
          title: "Tách luồng, nhưng tính đủ trường hợp lỗi",
          body: "Sự kiện tách producer khỏi consumer, cho phép fan-out và xử lý nền. Đổi lại phải có outbox, consumer idempotent, saga bù trừ và giám sát lag. Nhất quán sau là một lựa chọn thiết kế, không phải lỗi cần che.",
          focus: "all",
          edges: "all",
          metrics: { events: "được theo dõi", lag: "có cảnh báo", dupes: "bị chặn", state: "sau" },
          changes: ["Luồng sự kiện quan sát được", "Có kế hoạch bù trừ"],
          note: "Vẽ timeline cho một sự kiện từ lúc phát đến lúc mọi consumer xong. Chỗ nào không trả lời được thời gian, chỗ đó sẽ đau khi sự cố."
        }
      ]
    },

    "api-contract": {
      id: "api-contract",
      module: "architecture",
      title: "Hợp đồng API và phiên bản",
      shortTitle: "Hợp đồng API",
      subtitle: "API là lời hứa với người dùng bên ngoài. Thay đổi tưởng như nhỏ có thể làm hỏng client cũ; hợp đồng rõ, thay đổi tương thích và lộ trình ngừng phiên bản giúp hai bên tiến hóa an toàn.",
      blurb: "Thiết kế thay đổi API không làm gãy client cũ.",
      duration: "12 phút",
      level: "Trung cấp",
      tags: ["API", "contract", "versioning", "deprecation"],
      metrics: [
        { key: "version", label: "Phiên bản", tone: "blue" },
        { key: "breaking", label: "Thay đổi gãy", tone: "coral" },
        { key: "clients", label: "Client", tone: "green" },
        { key: "errors", label: "Lỗi 4xx", tone: "yellow" }
      ],
      nodes: [
        { id: "web", type: "client", x: 40, y: 80, w: 150, h: 64, label: "Web", sub: "client cũ" },
        { id: "mobile", type: "client", x: 40, y: 320, w: 150, h: 64, label: "Ứng dụng", sub: "chưa cập nhật" },
        { id: "gw", type: "gateway", x: 240, y: 200, w: 160, h: 64, label: "API gateway", sub: "định tuyến phiên bản" },
        { id: "v1", type: "server", x: 480, y: 80, w: 150, h: 64, label: "v1", sub: "giữ tương thích" },
        { id: "v2", type: "server", x: 480, y: 320, w: 150, h: 64, label: "v2", sub: "bỏ trường cũ" },
        { id: "schema", type: "file", x: 680, y: 200, w: 160, h: 64, label: "Lược đồ", sub: "OpenAPI" },
        { id: "metrics", type: "monitor", x: 240, y: 380, w: 160, h: 64, label: "Đo sử dụng", sub: "client nào gọi" }
      ],
      edges: [
        { id: "web-gw", from: "web", to: "gw", kind: "request", label: "/v1" },
        { id: "mobile-gw", from: "mobile", to: "gw", kind: "request", label: "/v1" },
        { id: "gw-v1", from: "gw", to: "v1", kind: "request", label: "định tuyến" },
        { id: "gw-v2", from: "gw", to: "v2", kind: "request", label: "định tuyến" },
        { id: "schema-v1", from: "schema", to: "v1", kind: "data", label: "kiểm tra" },
        { id: "schema-v2", from: "schema", to: "v2", kind: "data", label: "kiểm tra" },
        { id: "gw-metrics", from: "gw", to: "metrics", kind: "data", label: "ghi nhận" }
      ],
      learn: [
        "Phân biệt thay đổi tương thích và thay đổi gãy hợp đồng.",
        "Chọn cách đánh phiên bản phù hợp.",
        "Thiết kế lộ trình ngừng phiên bản có đo lường.",
        "Dùng lược đồ máy đọc để kiểm tra hợp đồng tự động."
      ],
      steps: [
        {
          short: "Hợp đồng",
          type: "TỔNG QUAN",
          title: "Client chỉ biết những gì được hứa",
          body: "Hợp đồng gồm đường dẫn, phương thức, tham số, mã lỗi và cấu trúc dữ liệu. Khi API trả thêm trường, client bỏ qua được và vẫn chạy. Khi đổi tên trường, đổi kiểu hoặc bỏ trường, client cũ có thể gãy ngay. <strong>Hợp đồng phải được ghi thành tệp máy đọc được.</strong>",
          focus: ["web", "mobile", "gw", "v1"],
          edges: ["web-gw", "mobile-gw", "gw-v1"],
          metrics: { version: "v1", breaking: "0", clients: "2", errors: "0%" },
          changes: ["Hợp đồng được ghi lại", "Client cũ vẫn chạy"],
          note: "Thêm trường tùy chọn thường an toàn. Đổi ý nghĩa một trường sẵn có lại là thay đổi gãy dù tên không đổi."
        },
        {
          short: "Tương thích",
          type: "KỸ THUẬT",
          title: "Thay đổi theo kiểu bổ sung",
          body: "Muốn đổi tên trường, hãy thêm trường mới, ghi cả hai trong một thời gian, cập nhật client rồi mới bỏ trường cũ. Muốn đổi cách phân trang, thêm tham số mới với hành vi mặc định cũ. Cách này giữ client cũ chạy trong khi hai bên chuyển dần.",
          focus: ["v1", "v2", "schema"],
          edges: ["schema-v1", "schema-v2", "gw-v2"],
          metrics: { version: "v1+v2", breaking: "0", clients: "2", errors: "0%" },
          changes: ["Trường mới được thêm", "Trường cũ còn đọc được"],
          note: "Viết test hợp đồng chạy trên cả hai phiên bản. Contract test bắt lỗi gãy trước khi client phát hiện."
        },
        {
          short: "Phiên bản",
          type: "KIẾN TRÚC",
          title: "Đánh phiên bản ở nơi client thấy",
          body: "Có nhiều cách: đường dẫn /v2, header, hoặc tên trường. Điều quan trọng là client chọn được phiên bản và gateway định tuyến ổn định. Đừng để phiên bản nằm trong tài liệu mà không có trong đường gọi; client sẽ không biết mình đang dùng bản nào.",
          focus: ["gw", "v1", "v2"],
          edges: ["gw-v1", "gw-v2"],
          metrics: { version: "v1, v2", breaking: "có kiểm soát", clients: "2", errors: "0%" },
          changes: ["Gateway định tuyến theo phiên bản", "Hai bản chạy song song"],
          note: "Mỗi phiên bản là một chi phí vận hành. Chỉ mở phiên bản mới khi thật sự cần thay đổi gãy."
        },
        {
          short: "Ngừng",
          type: "VẬN HÀNH",
          title: "Muốn bỏ bản cũ, phải đo được ai còn dùng",
          body: "Trước khi ngừng v1, ghi nhận client nào còn gọi theo mã ứng dụng hoặc khóa API, thông báo trước, cung cấp hướng chuyển và đặt ngày tắt. Nếu chỉ nhìn tổng lưu lượng, bạn không biết client quan trọng nào còn kẹt lại.",
          focus: ["web", "mobile", "gw", "metrics"],
          edges: ["gw-metrics", "web-gw", "mobile-gw"],
          warn: ["mobile"],
          metrics: { version: "v2", breaking: "đã lên kế hoạch", clients: "1 còn kẹt", errors: "tăng nhẹ" },
          changes: ["Biết client nào còn gọi v1", "Có ngày tắt và thông báo"],
          note: "Trả về header cảnh báo ngừng dùng và mã lỗi rõ ràng khi v1 tắt. Đừng trả 404 im lặng."
        },
        {
          short: "Tóm tắt",
          type: "TÓM TẮT",
          tone: "final",
          title: "Hợp đồng trước, thay đổi sau",
          body: "Ghi hợp đồng máy đọc được, ưu tiên thay đổi bổ sung, đánh phiên bản ở nơi client thấy và đo lượng sử dụng trước khi ngừng bản cũ. API tốt không phải bất biến, mà là thay đổi có đường cho cả hai phía.",
          focus: "all",
          edges: "all",
          metrics: { version: "v1, v2", breaking: "có kế hoạch", clients: "được đo", errors: "theo dõi" },
          changes: ["Hợp đồng được kiểm tự động", "Ngừng phiên bản có dữ liệu"],
          note: "Client không đọc tài liệu thường xuyên. Hãy để lược đồ và contract test nói thay tài liệu."
        }
      ]
    },

    "resilience": {
      id: "resilience",
      module: "architecture",
      title: "Chịu lỗi có kiểm soát",
      shortTitle: "Chịu lỗi",
      subtitle: "Hệ thống phân tán chắc chắn có lúc hỏng. Chịu lỗi không phải cố chạy mãi, mà là hỏng nhỏ, hỏng nhanh và không lan: timeout, retry có giới hạn, cầu dao, khoang cách ly và đường dự phòng.",
      blurb: "Hỏng một phần mà người dùng vẫn dùng được phần còn lại.",
      duration: "14 phút",
      level: "Trung cấp",
      tags: ["timeout", "retry", "circuit breaker", "bulkhead"],
      metrics: [
        { key: "timeout", label: "Timeout", tone: "blue" },
        { key: "retries", label: "Lần thử", tone: "yellow" },
        { key: "errors", label: "Lỗi", tone: "coral" },
        { key: "budget", label: "Ngân sách lỗi", tone: "green" }
      ],
      nodes: [
        { id: "user", type: "client", x: 40, y: 210, w: 150, h: 64, label: "Người dùng", sub: "request" },
        { id: "edge", type: "gateway", x: 230, y: 210, w: 160, h: 64, label: "Cổng vào", sub: "timeout, retry" },
        { id: "breaker", type: "gate", x: 430, y: 210, w: 160, h: 64, label: "Cầu dao", sub: "đóng, mở, nửa mở" },
        { id: "svc", type: "server", x: 630, y: 80, w: 160, h: 64, label: "Dịch vụ", sub: "phụ thuộc" },
        { id: "db", type: "db", x: 630, y: 340, w: 160, h: 64, label: "CSDL", sub: "chậm thì chết" },
        { id: "fallback", type: "cache", x: 430, y: 380, w: 160, h: 64, label: "Dự phòng", sub: "dữ liệu cũ" },
        { id: "alert", type: "monitor", x: 230, y: 380, w: 160, h: 64, label: "Cảnh báo", sub: "tỉ lệ lỗi, độ trễ" }
      ],
      edges: [
        { id: "user-edge", from: "user", to: "edge", kind: "request", label: "gọi" },
        { id: "edge-breaker", from: "edge", to: "breaker", kind: "request", label: "qua" },
        { id: "breaker-svc", from: "breaker", to: "svc", kind: "request", label: "cho qua" },
        { id: "svc-db", from: "svc", to: "db", kind: "data", label: "truy vấn" },
        { id: "breaker-fallback", from: "breaker", to: "fallback", kind: "data", label: "mở thì dùng" },
        { id: "edge-alert", from: "edge", to: "alert", kind: "data", label: "đo" }
      ],
      learn: [
        "Đặt timeout ngắn hơn ngân sách độ trễ của toàn request.",
        "Thêm jitter và giới hạn số lần retry.",
        "Áp dụng circuit breaker để ngừng gọi dịch vụ đang hỏng.",
        "Cô lập tài nguyên bằng bulkhead và có fallback rõ ràng."
      ],
      steps: [
        {
          short: "Timeout",
          type: "TỔNG QUAN",
          title: "Không có timeout là chờ vô hạn",
          body: "Một lời gọi không có timeout sẽ giữ kết nối, luồng và bộ nhớ cho đến khi tầng dưới cùng bỏ cuộc. Timeout phải ngắn hơn ngân sách của request và có deadline lan truyền: nếu cổng chỉ còn 200 ms, dịch vụ phía sau không được chờ 2 giây.",
          focus: ["user", "edge", "svc"],
          edges: ["user-edge", "edge-breaker"],
          metrics: { timeout: "800 ms", retries: "0", errors: "0,3%", budget: "99,9%" },
          changes: ["Có hạn chờ rõ ràng", "Giải phóng tài nguyên sớm"],
          note: "Timeout quá dài cũng tệ như không có. Nó biến một sự cố cục bộ thành hàng đợi kẹt toàn hệ thống."
        },
        {
          short: "Retry",
          type: "KỸ THUẬT",
          title: "Thử lại phải có giới hạn và nhiễu",
          body: "Chỉ retry lỗi tạm thời như 503 hoặc timeout, không retry lỗi 400. Dùng số lần nhỏ, backoff tăng dần và jitter để nhiều client không cùng dồn đập một lúc. Thao tác không idempotent phải có khóa trước khi retry.",
          focus: ["edge", "svc", "alert"],
          edges: ["edge-breaker", "breaker-svc", "edge-alert"],
          metrics: { timeout: "800 ms", retries: "2 + jitter", errors: "0,1%", budget: "99,9%" },
          changes: ["Số lần thử bị giới hạn", "Nhiễu tránh dồn đập"],
          note: "Retry ba lớp, mỗi lớp hai lần, tạo ra 8 lần gọi. Cộng dồn theo chuỗi là cách nhanh nhất tạo bão."
        },
        {
          short: "Cầu dao",
          type: "KIẾN TRÚC",
          title: "Hỏng liên tục thì ngừng gọi một lúc",
          body: "Circuit breaker đếm lỗi trong một cửa sổ. Khi vượt ngưỡng, nó mở và trả lỗi ngay thay vì chờ timeout. Sau một khoảng, nó chuyển nửa mở để thử vài request; thành công thì đóng lại. Nhờ vậy dịch vụ phía sau có thời gian hồi phục.",
          focus: ["breaker", "svc", "fallback"],
          edges: ["breaker-svc", "breaker-fallback"],
          metrics: { timeout: "800 ms", retries: "2", errors: "được cắt", budget: "giữ" },
          changes: ["Ngưỡng mở cầu dao", "Thử lại ở trạng thái nửa mở"],
          note: "Cầu dao cần tham số theo từng phụ thuộc. Một ngưỡng chung cho mọi dịch vụ thường quá nhạy hoặc quá lì."
        },
        {
          short: "Cô lập",
          type: "VẬN HÀNH",
          title: "Khoang kín và đường dự phòng",
          body: "Bulkhead giới hạn số kết nối hoặc luồng cho từng phụ thuộc, để một dịch vụ chậm không chiếm hết tài nguyên. Fallback trả dữ liệu cache, nội dung tĩnh hoặc chức năng giảm thiểu. Cả hai phải được nói rõ với người dùng thay vì trả trang lỗi trắng.",
          focus: ["edge", "breaker", "fallback", "alert"],
          edges: ["breaker-fallback", "edge-alert"],
          warn: ["svc"],
          metrics: { timeout: "800 ms", retries: "2", errors: "bị khoanh vùng", budget: "theo dõi" },
          changes: ["Tài nguyên chia theo phụ thuộc", "Có nội dung dự phòng"],
          note: "Đo tỉ lệ fallback. Nếu fallback chạy thường xuyên, nó đã thành đường chính và cần được thiết kế lại."
        },
        {
          short: "Tóm tắt",
          type: "TÓM TẮT",
          tone: "final",
          title: "Hỏng nhỏ, biết mình đang hỏng",
          body: "Timeout, retry có giới hạn, cầu dao, bulkhead và fallback là bộ công cụ giữ lỗi không lan. Kèm theo phải có cảnh báo theo ngân sách lỗi để biết khi nào nên dừng phát hành tính năng mới và sửa độ ổn định.",
          focus: "all",
          edges: "all",
          metrics: { timeout: "có deadline", retries: "giới hạn", errors: "được khoanh vùng", budget: "có cảnh báo" },
          changes: ["Lỗi không lan toàn hệ thống", "Có tín hiệu để quyết định"],
          note: "Kiểm thử chịu lỗi bằng cách tiêm độ trễ và lỗi trên staging. Đừng chờ sự cố thật để biết cầu dao có hoạt động."
        }
      ]
    },

    "adr-tech-debt": {
      id: "adr-tech-debt",
      module: "architecture",
      title: "Quyết định kiến trúc và nợ kỹ thuật",
      shortTitle: "ADR & nợ",
      subtitle: "Kiến trúc là một chuỗi quyết định có bối cảnh. Ghi lại lựa chọn, phương án đã cân nhắc và hệ quả giúp người sau hiểu vì sao, còn nợ kỹ thuật cần được nhìn thấy và trả có kế hoạch.",
      blurb: "Ghi lại vì sao, để mai sau không phải đoán.",
      duration: "13 phút",
      level: "Trung cấp",
      tags: ["ADR", "trade-off", "tech debt", "fitness function"],
      metrics: [
        { key: "adrs", label: "ADR", tone: "blue" },
        { key: "options", label: "Phương án", tone: "violet" },
        { key: "debt", label: "Nợ", tone: "coral" },
        { key: "review", label: "Rà soát", tone: "green" }
      ],
      nodes: [
        { id: "problem", type: "bulb", x: 40, y: 200, w: 160, h: 64, label: "Vấn đề", sub: "bối cảnh và ràng buộc" },
        { id: "options", type: "branch", x: 250, y: 90, w: 160, h: 64, label: "Phương án", sub: "ít nhất hai lựa chọn" },
        { id: "adr", type: "file", x: 250, y: 320, w: 160, h: 64, label: "ADR", sub: "quyết định và lý do" },
        { id: "code", type: "code", x: 470, y: 200, w: 160, h: 64, label: "Mã nguồn", sub: "hiện thực" },
        { id: "debt", type: "artifact", x: 470, y: 380, w: 160, h: 64, label: "Nợ kỹ thuật", sub: "đánh đổi đã ghi" },
        { id: "review", type: "monitor", x: 680, y: 200, w: 160, h: 64, label: "Rà soát", sub: "định kỳ" },
        { id: "test", type: "test", x: 680, y: 380, w: 160, h: 64, label: "Fitness test", sub: "kiểm tra ràng buộc" }
      ],
      edges: [
        { id: "problem-options", from: "problem", to: "options", kind: "data", label: "khảo sát" },
        { id: "problem-adr", from: "problem", to: "adr", kind: "data", label: "ghi bối cảnh" },
        { id: "adr-code", from: "adr", to: "code", kind: "request", label: "hướng dẫn" },
        { id: "code-debt", from: "code", to: "debt", kind: "data", label: "đánh đổi" },
        { id: "debt-review", from: "debt", to: "review", kind: "data", label: "xem lại" },
        { id: "test-code", from: "test", to: "code", kind: "data", label: "kiểm tra" },
        { id: "review-adr", from: "review", to: "adr", kind: "data", label: "cập nhật", bow: 14 }
      ],
      learn: [
        "Viết ADR ngắn gọn với bối cảnh, phương án và hệ quả.",
        "Phân biệt nợ kỹ thuật cố ý và nợ do thiếu hiểu biết.",
        "Đưa nợ vào quy trình thay vì danh sách treo.",
        "Dùng fitness function để giữ ràng buộc kiến trúc."
      ],
      steps: [
        {
          short: "ADR",
          type: "TỔNG QUAN",
          title: "Một quyết định, một trang",
          body: "ADR ghi bối cảnh, các phương án đã cân nhắc, quyết định và hệ quả. Nó không phải tài liệu thiết kế dài, mà là nhật ký để người mới hiểu vì sao hệ thống như hiện tại. ADR cũ không bị sửa; khi đổi ý, viết ADR mới thay thế.",
          focus: ["problem", "options", "adr"],
          edges: ["problem-options", "problem-adr"],
          metrics: { adrs: "1", options: "2", debt: "chưa ghi", review: "chưa" },
          changes: ["Bối cảnh được lưu", "Phương án bị loại có lý do"],
          note: "Ghi cả ràng buộc thời gian và ngân sách. Nhiều quyết định chỉ đúng trong bối cảnh của nó."
        },
        {
          short: "Đánh đổi",
          type: "KỸ THUẬT",
          title: "Không có phương án miễn phí",
          body: "Chọn CSDL quan hệ đổi tính linh hoạt lấy giao dịch và truy vấn. Chọn dịch vụ độc lập đổi đơn giản vận hành lấy khả năng mở rộng theo nhóm. ADR phải nêu cái mất, không chỉ cái được. <strong>Quyết định không có hệ quả xấu là chưa được phân tích đủ.</strong>",
          focus: ["options", "adr", "code"],
          edges: ["problem-options", "adr-code"],
          metrics: { adrs: "2", options: "3", debt: "được nêu", review: "chưa" },
          changes: ["Cái mất được ghi rõ", "Điều kiện xem lại được đặt"],
          note: "Thêm mục “khi nào xem lại”. Ví dụ: khi lưu lượng vượt 5.000 request mỗi giây hoặc khi nhóm vượt 20 người."
        },
        {
          short: "Nợ",
          type: "CẢNH BÁO",
          title: "Nợ cố ý khác nợ vô tình",
          body: "Nợ cố ý là đánh đổi có ghi chú, ví dụ tạm dùng khóa toàn cục để kịp mùa cao điểm. Nợ vô tình là thiếu hiểu biết hoặc bỏ qua kiểm tra, thường không ai biết cho đến khi sự cố. Cả hai đều cần nhìn thấy, nhưng chỉ loại thứ nhất có ngày trả dự kiến.",
          focus: ["code", "debt", "review"],
          edges: ["code-debt", "debt-review"],
          warn: ["debt"],
          metrics: { adrs: "2", options: "3", debt: "3 mục", review: "hằng quý" },
          changes: ["Nợ có chủ sở hữu", "Có ngày trả hoặc điều kiện trả"],
          note: "Đừng ghi nợ vào một trang wiki không ai mở. Gắn nhãn trong mã và đưa vào bảng công việc của nhóm."
        },
        {
          short: "Kiểm tra",
          type: "VẬN HÀNH",
          title: "Ràng buộc phải được máy kiểm",
          body: "Fitness function là kiểm tra tự động cho ràng buộc kiến trúc: không import chéo gói, độ trễ p95 dưới ngưỡng, mọi dịch vụ có health check, lược đồ API không có thay đổi gãy. Đưa vào pipeline để ràng buộc không bị bào mòn theo thời gian.",
          focus: ["test", "code", "review", "adr"],
          edges: ["test-code", "review-adr"],
          metrics: { adrs: "3", options: "3", debt: "được theo dõi", review: "tự động" },
          changes: ["Ràng buộc thành test", "Vi phạm chặn merge"],
          note: "Bắt đầu bằng một fitness test đơn giản như cấm import giữa hai gói. Ít nhưng chạy thật tốt hơn danh sách quy tắc dài."
        },
        {
          short: "Tóm tắt",
          type: "TÓM TẮT",
          tone: "final",
          title: "Quyết định có bối cảnh, nợ có chủ",
          body: "Viết ADR cho quyết định khó đảo ngược, ghi rõ phương án bị loại và hệ quả. Đưa nợ kỹ thuật vào công việc hằng ngày với chủ sở hữu và điều kiện trả. Dùng fitness function để ràng buộc kiến trúc không bị lãng quên.",
          focus: "all",
          edges: "all",
          metrics: { adrs: "3", options: "3", debt: "có kế hoạch", review: "tự động" },
          changes: ["Tri thức kiến trúc không mất", "Nợ được trả có chủ đích"],
          note: "Kiến trúc tốt là kiến trúc giải thích được. Nếu chỉ một người hiểu vì sao, đó là rủi ro chứ không phải tài sản."
        }
      ]
    }
  });

  SL.practice.push(
    {
      id: "p13",
      tag: "Kiến trúc",
      title: "Tách dịch vụ nhưng chung CSDL",
      scenario: "Nhóm tách đơn hàng và kho thành hai dịch vụ nhưng vẫn cho cả hai đọc ghi trực tiếp cùng một lược đồ. Mỗi lần kho đổi cột, dịch vụ đơn hàng phải deploy theo. Nhóm muốn giảm ràng buộc mà không viết lại toàn bộ.",
      metrics: [
        { label: "Dịch vụ", value: "2" },
        { label: "CSDL", value: "dùng chung", danger: true },
        { label: "Deploy", value: "dính nhau", danger: true },
        { label: "Mục tiêu", value: "giảm ghép nối" }
      ],
      options: [
        "Đổi tên bảng để hai dịch vụ không đụng nhau",
        "Chuyển sang hợp đồng API hoặc sự kiện, từng bước tách quyền sở hữu dữ liệu",
        "Thêm bản sao CSDL cho mỗi dịch vụ nhưng vẫn ghi cả hai",
        "Gộp lại thành monolith ngay lập tức"
      ],
      correct: 1,
      explain: "Ranh giới dịch vụ phải đi kèm quyền sở hữu dữ liệu. Đổi tên bảng hoặc nhân bản ghi hai chiều vẫn giữ ghép nối. Cần chuyển giao tiếp sang API hoặc sự kiện và tách dần lược đồ, có giai đoạn chuyển tiếp rõ ràng."
    },
    {
      id: "p14",
      tag: "Kiến trúc",
      title: "Lõi nghiệp vụ import ORM",
      scenario: "Lõi tính giá import trực tiếp ORM và đọc biến môi trường. Mỗi lần chạy test phải dựng CSDL; đổi thư viện CSDL kéo theo sửa hàng loạt quy tắc nghiệp vụ. Nhóm muốn kiểm thử nhanh và thay hạ tầng dễ hơn.",
      metrics: [
        { label: "Lõi", value: "phụ thuộc ORM", danger: true },
        { label: "Test", value: "cần CSDL", danger: true },
        { label: "Đổi hạ tầng", value: "đắt" },
        { label: "Mục tiêu", value: "lõi sạch" }
      ],
      options: [
        "Mock ORM trong mọi test",
        "Đưa truy cập dữ liệu ra sau cổng, adapter hạ tầng hiện thực cổng đó",
        "Chuyển toàn bộ sang stored procedure",
        "Cho lõi đọc thẳng tệp cấu hình thay vì biến môi trường"
      ],
      correct: 1,
      explain: "Quy tắc phụ thuộc nói lõi không được biết hạ tầng. Khai báo cổng lưu trữ và để adapter ORM hiện thực giúp test lõi chạy trong bộ nhớ, đồng thời thay CSDL chỉ cần viết adapter mới. Mock ORM chỉ che vấn đề."
    },
    {
      id: "p15",
      tag: "Sự kiện",
      title: "Khách nhận hai email xác nhận",
      scenario: "Broker gửi ít nhất một lần. Một sự kiện đơn hàng bị gửi lặp sau khi consumer xử lý xong nhưng trước khi xác nhận. Consumer gửi email ngay trong bước xử lý nên khách nhận hai thư.",
      metrics: [
        { label: "Gửi", value: "ít nhất một lần" },
        { label: "Email", value: "trùng", danger: true },
        { label: "Consumer", value: "chưa idempotent", danger: true },
        { label: "Mục tiêu", value: "không gửi lặp" }
      ],
      options: [
        "Đổi broker sang chế độ gửi đúng một lần và giả định không lặp",
        "Ghi mã sự kiện đã xử lý trong cùng giao dịch nghiệp vụ và bỏ qua lần lặp",
        "Thêm độ trễ ngẫu nhiên trước khi gửi email",
        "Chỉ gửi email từ dịch vụ đơn hàng, không qua sự kiện"
      ],
      correct: 1,
      explain: "Ít nhất một lần là mô hình phổ biến và không thể loại bỏ hoàn toàn trùng lặp ở phía broker. Consumer cần idempotent: lưu mã sự kiện đã xử lý cùng thay đổi nghiệp vụ rồi bỏ qua bản lặp. Trễ ngẫu nhiên không giải quyết gốc."
    },
    {
      id: "p16",
      tag: "API",
      title: "Đổi tên trường làm app cũ gãy",
      scenario: "Đội backend đổi trường customer_id thành customerId trong cùng phiên bản v1. Ứng dụng di động bản cũ chưa cập nhật nên đọc trường cũ bị rỗng và hiển thị sai. Bản web mới đã dùng tên mới.",
      metrics: [
        { label: "Phiên bản", value: "v1" },
        { label: "Client cũ", value: "còn chạy", danger: true },
        { label: "Thay đổi", value: "gãy hợp đồng", danger: true },
        { label: "Mục tiêu", value: "tương thích" }
      ],
      options: [
        "Yêu cầu toàn bộ người dùng cập nhật ứng dụng ngay",
        "Trả cả hai tên trường trong giai đoạn chuyển tiếp, đo lượng dùng rồi mới bỏ tên cũ",
        "Trả lỗi 500 cho client còn dùng tên cũ để buộc nâng cấp",
        "Tạo phiên bản v2 và tắt v1 ngay hôm sau"
      ],
      correct: 1,
      explain: "Đổi tên trường là thay đổi gãy hợp đồng. Cách an toàn là bổ sung trường mới, giữ trường cũ trong thời gian chuyển tiếp, đo client còn dùng và thông báo trước khi bỏ. Tắt ngay hoặc trả lỗi chỉ đẩy sự cố sang người dùng."
    },
    {
      id: "p17",
      tag: "Chịu lỗi",
      title: "Bão retry làm sập dịch vụ vừa hồi",
      scenario: "Một dịch vụ thanh toán quá tải trong 30 giây. Ba lớp client đều retry hai lần với backoff cố định, không có jitter. Khi dịch vụ vừa hồi, lưu lượng dồn cùng lúc làm nó sập tiếp.",
      metrics: [
        { label: "Lớp retry", value: "3", danger: true },
        { label: "Jitter", value: "không", danger: true },
        { label: "Dịch vụ", value: "vừa hồi" },
        { label: "Mục tiêu", value: "hồi phục êm" }
      ],
      options: [
        "Tăng số lần retry để chắc chắn thành công",
        "Giới hạn retry theo từng lớp, thêm jitter và dùng cầu dao để ngừng gọi khi dịch vụ còn yếu",
        "Bỏ timeout để request chờ lâu hơn",
        "Giảm số client bằng cách chặn một nửa người dùng"
      ],
      correct: 1,
      explain: "Retry cộng dồn theo chuỗi tạo ra bão. Cần ngân sách retry tổng, jitter để phân tán thời điểm thử lại và cầu dao để bảo vệ dịch vụ đang hồi phục. Tăng retry hoặc bỏ timeout làm tình hình tệ hơn."
    },
    {
      id: "p18",
      tag: "Quyết định",
      title: "Không ai nhớ vì sao chọn Kafka",
      scenario: "Hệ thống dùng một nền tảng hàng đợi phức tạp. Hai năm sau, nhóm mới muốn thay bằng dịch vụ đơn giản hơn nhưng không tìm được tài liệu về ràng buộc ban đầu. Một người cũ nhớ mang máng là do yêu cầu thứ tự.",
      metrics: [
        { label: "Tài liệu", value: "không có", danger: true },
        { label: "Quyết định", value: "2 năm trước" },
        { label: "Ràng buộc", value: "mơ hồ", danger: true },
        { label: "Mục tiêu", value: "đổi nền tảng an toàn" }
      ],
      options: [
        "Thay ngay vì công nghệ mới tốt hơn",
        "Truy lại yêu cầu thứ tự và độ bền, viết ADR mô tả hiện trạng rồi mới đánh giá phương án",
        "Giữ nguyên vĩnh viễn vì đã chạy ổn",
        "Hỏi ý kiến nhà cung cấp nền tảng mới rồi quyết"
      ],
      correct: 1,
      explain: "Trước khi đổi, phải khôi phục ràng buộc thật: có cần thứ tự theo khóa, gửi ít nhất một lần, lưu giữ bao lâu. Viết ADR ghi hiện trạng và tiêu chí đánh giá rồi mới so sánh. Giữ vĩnh viễn hoặc đổi theo cảm tính đều bỏ qua kỹ thuật."
    }
  );

  SL.cheatsheets.push({
    id: "architecture",
    num: "08",
    title: "Kiến trúc",
    intro: "Câu hỏi kiểm tra nhanh trước khi chọn ranh giới dịch vụ, hợp đồng API hay cách chịu lỗi.",
    cards: [
      {
        title: "Chọn ranh giới dịch vụ",
        wide: true,
        html: '<table class="cheat-table"><thead><tr><th>Câu hỏi</th><th>Dấu hiệu nên tách</th><th>Dấu hiệu nên gộp</th></tr></thead><tbody><tr><td>Ai sở hữu dữ liệu?</td><td>Hai miền có ngôn ngữ và quy tắc riêng</td><td>Phải đọc chung bảng để trả một màn hình</td></tr><tr><td>Nhịp thay đổi?</td><td>Một phần đổi hằng tuần, phần kia hằng quý</td><td>Mọi thay đổi luôn đi cùng nhau</td></tr><tr><td>Nhu cầu mở rộng?</td><td>Một phần cần scale gấp nhiều lần</td><td>Tải tương đương và nhỏ</td></tr><tr><td>Năng lực vận hành?</td><td>Có trace, log tập trung, on-call</td><td>Chưa có quan sát xuyên dịch vụ</td></tr></tbody></table>'
      },
      {
        title: "Checklist hợp đồng API",
        html: '<div class="check-list"><span>Lược đồ máy đọc được và nằm trong repo.</span><span>Thay đổi gãy có phiên bản mới.</span><span>Client cũ chạy được trong thời gian chuyển tiếp.</span><span>Đo được client nào còn dùng bản cũ.</span><span>Có ngày tắt và thông báo trước.</span></div>'
      },
      {
        title: "Bộ đệm chịu lỗi",
        html: '<div class="check-list"><span>Timeout ngắn hơn ngân sách request.</span><span>Retry có giới hạn, backoff và jitter.</span><span>Circuit breaker theo từng phụ thuộc.</span><span>Bulkhead giới hạn tài nguyên mỗi phụ thuộc.</span><span>Fallback rõ ràng và có đo lường.</span></div>'
      },
      {
        title: "ADR tối thiểu",
        html: '<pre><code># ADR-012: Tách dịch vụ kho\n\n## Bối cảnh\nKho cần scale theo mùa; đơn hàng ổn định.\n\n## Phương án\n1. Giữ monolith, thêm bản sao đọc.\n2. Tách dịch vụ kho, giao tiếp qua sự kiện.\n\n## Quyết định\nChọn 2, bắt đầu bằng outbox và API.\n\n## Hệ quả\n+ Kho scale độc lập.\n- Cần trace xuyên dịch vụ, nhất quán sau.\n\n## Xem lại khi\nLag sự kiện > 5 giây hoặc chi phí vận hành tăng gấp đôi.</code></pre>'
      }
    ]
  });
})(window.SCALELAB);
