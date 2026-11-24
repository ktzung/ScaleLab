/* ScaleLab course data — phần 2 */
(function (SL) {
  "use strict";

  Object.assign(SL.lessons, {
    "replication": {
      id: "replication",
      module: "data",
      title: "Replication",
      shortTitle: "Replication",
      subtitle: "Giữ nhiều bản sao của cùng một dữ liệu để tăng khả năng đọc và chịu lỗi. Cái giá là độ trễ sao chép và những tình huống nhất quán khó chịu.",
      blurb: "Nhân bản dữ liệu để đọc nhanh hơn và sống sót khi một node chết.",
      duration: "11 phút",
      level: "Trung cấp",
      tags: ["primary", "replica", "replication lag", "failover"],
      metrics: [
        { key: "write", label: "Ghi", tone: "blue" },
        { key: "lag", label: "Độ trễ sao chép", tone: "yellow" },
        { key: "read", label: "Đọc", tone: "green" },
        { key: "failover", label: "Failover", tone: "coral" }
      ],
      nodes: [
        { id: "app", type: "server", x: 55, y: 210, w: 140, h: 64, label: "App server", sub: "ghi + đọc" },
        { id: "primary", type: "db", x: 275, y: 210, w: 150, h: 64, label: "Primary", sub: "nhận ghi" },
        { id: "r1", type: "db", x: 500, y: 64, w: 130, h: 64, label: "Replica 1", sub: "đọc" },
        { id: "r2", type: "db", x: 500, y: 210, w: 130, h: 64, label: "Replica 2", sub: "đọc" },
        { id: "r3", type: "db", x: 500, y: 356, w: 130, h: 64, label: "Replica 3", sub: "đọc" },
        { id: "readers", type: "client", x: 720, y: 210, w: 135, h: 64, label: "Read traffic", sub: "từ ứng dụng" }
      ],
      edges: [
        { id: "write", from: "app", to: "primary", kind: "request", label: "write" },
        { id: "rep1", from: "primary", to: "r1", kind: "data", label: "replicate" },
        { id: "rep2", from: "primary", to: "r2", kind: "data" },
        { id: "rep3", from: "primary", to: "r3", kind: "data" },
        { id: "read1", from: "r1", to: "readers", kind: "response", label: "read" },
        { id: "read2", from: "r2", to: "readers", kind: "response" },
        { id: "read3", from: "r3", to: "readers", kind: "response" }
      ],
      learn: [
        "Mô tả luồng ghi vào primary và sao chép sang replica.",
        "Giải thích replication lag và vấn đề read-your-writes.",
        "Dùng replica để mở rộng khả năng đọc.",
        "Hiểu những rủi ro của failover và split-brain."
      ],
      steps: [
        {
          short: "Bản sao",
          type: "TỔNG QUAN",
          title: "Một bản chính, nhiều bản sao",
          body: "Primary nhận ghi và là nguồn sự thật. Các replica nhận bản sao dữ liệu để phục vụ đọc hoặc làm phương án dự phòng. Hệ thống đọc được nhiều hơn, nhưng dữ liệu ở replica có thể trễ hơn primary.",
          focus: ["app", "primary", "r2", "readers"],
          edges: ["write", "rep2", "read2"],
          metrics: { write: "8.000/s", lag: "20 ms", read: "40.000/s", failover: "Chưa" },
          changes: ["Primary nhận ghi", "Replica phục vụ đọc"],
          note: "Replication không thay thế backup. Một lệnh xóa sai cũng được sao chép sang replica gần như ngay lập tức."
        },
        {
          short: "Ghi primary",
          type: "KỸ THUẬT",
          title: "Mọi thay đổi đi qua primary",
          body: "Ứng dụng gửi ghi tới primary. Sau khi giao dịch hoàn tất, primary ghi vào log và gửi thay đổi cho các replica. Tách đường ghi giúp tránh xung đột nhưng tạo ra một điểm ghi tập trung.",
          focus: ["app", "primary"],
          edges: ["write"],
          metrics: { write: "12.000/s", lag: "20 ms", read: "0/s", failover: "Chưa" },
          changes: ["+ Write path", "Primary là nguồn sự thật"],
          note: "Nếu ghi vượt năng lực primary, thêm replica không giải quyết vấn đề. Khi đó cần sharding hoặc tách workload."
        },
        {
          short: "Độ trễ",
          type: "CẢNH BÁO",
          tone: "warn",
          title: "Sao chép bất đồng bộ và độ trễ",
          body: "Với async replication, primary trả lời trước khi replica nhận xong. Vì vậy người dùng có thể ghi xong rồi đọc từ replica và không thấy dữ liệu vừa ghi. Đó là <strong>replication lag</strong>.",
          focus: ["primary", "r1", "r2", "r3"],
          edges: ["rep1", "rep2", "rep3"],
          metrics: { write: "12.000/s", lag: "20–200 ms", read: "0/s", failover: "Chưa" },
          changes: ["+ Dữ liệu lan sang replica", "Đọc có thể thấy dữ liệu cũ"],
          note: "Read-your-writes có thể được xử lý bằng cách đọc từ primary trong một khoảng ngắn sau khi ghi, hoặc theo dõi vị trí log."
        },
        {
          short: "Đọc replica",
          type: "KỸ THUẬT",
          title: "Mở rộng đường đọc",
          body: "Khi phần lớn request là đọc, thêm replica giúp tăng throughput đọc gần tuyến tính. Ứng dụng hoặc một router cần biết request nào được phép đọc từ replica và request nào cần dữ liệu mới nhất.",
          focus: ["r1", "r2", "r3", "readers"],
          edges: ["read1", "read2", "read3"],
          metrics: { write: "12.000/s", lag: "20–200 ms", read: "40.000/s", failover: "Chưa" },
          changes: ["+ Read traffic", "Replica chịu tải đọc"],
          note: "Đừng đọc từ replica ngay sau khi ghi nếu nghiệp vụ yêu cầu dữ liệu mới nhất. Hãy đưa ra quy tắc rõ ràng."
        },
        {
          short: "Failover",
          type: "CẢNH BÁO",
          tone: "warn",
          title: "Khi primary chết",
          body: "Hệ thống cần bầu một replica lên làm primary mới. Failover tự động rất hữu ích nhưng có thể tạo ra split-brain nếu hai node cùng nghĩ mình là primary. Cần cơ chế fencing và quorum.",
          focus: ["primary", "r2", "readers"],
          edges: ["rep2"],
          metrics: { write: "0/s", lag: "—", read: "32.000/s", failover: "R2 lên primary" },
          warn: ["primary"],
          changes: ["Primary cũ ngừng nhận ghi", "Replica được promote"],
          note: "Failover không chỉ là đổi vai trò. Cần đảm bảo client, cấu hình và các replica khác cùng nhìn thấy primary mới."
        },
        {
          short: "Tóm tắt",
          type: "TÓM TẮT",
          tone: "final",
          title: "Replication là đánh đổi có kiểm soát",
          body: "Nhiều replica giúp đọc nhanh hơn và tăng khả năng chịu lỗi, nhưng tạo ra độ trễ sao chép. Hãy xác định rõ dữ liệu nào được phép cũ, ai được đọc từ đâu và failover sẽ diễn ra như thế nào.",
          focus: "all",
          edges: "all",
          metrics: { write: "12.000/s", lag: "20–200 ms", read: "40.000/s", failover: "R2 lên primary" },
          changes: ["Đọc mở rộng, ghi tập trung", "Luôn đo replication lag"],
          note: "Tiếp theo: khi dữ liệu lớn đến mức một primary cũng không đủ, sharding chia dữ liệu theo khóa."
        }
      ]
    },

    "sharding": {
      id: "sharding",
      module: "data",
      title: "Sharding",
      shortTitle: "Sharding",
      subtitle: "Khi một database không còn đủ chỗ hoặc đủ nhanh, sharding chia dữ liệu thành nhiều mảnh. Chọn sai khóa shard sẽ tạo ra hot shard và những lần reshard đau đớn.",
      blurb: "Chia dữ liệu theo khóa để vượt giới hạn một máy.",
      duration: "12 phút",
      level: "Trung cấp",
      tags: ["shard key", "hash", "hot shard", "consistent hashing"],
      metrics: [
        { key: "shards", label: "Số shard", tone: "blue" },
        { key: "hot", label: "Tải shard nóng", tone: "coral" },
        { key: "rebalance", label: "Rebalance", tone: "violet" },
        { key: "p95", label: "p95", tone: "green" }
      ],
      nodes: [
        { id: "app", type: "server", x: 55, y: 210, w: 140, h: 64, label: "App server", sub: "truy vấn" },
        { id: "router", type: "router", x: 265, y: 210, w: 150, h: 64, label: "Shard router", sub: "hash(key)" },
        { id: "s1", type: "db", x: 505, y: 64, w: 150, h: 64, label: "Shard A", sub: "user 0–33%" },
        { id: "s2", type: "db", x: 505, y: 210, w: 150, h: 64, label: "Shard B", sub: "user 33–66%" },
        { id: "s3", type: "db", x: 505, y: 356, w: 150, h: 64, label: "Shard C", sub: "user 66–99%" }
      ],
      edges: [
        { id: "in", from: "app", to: "router", kind: "request", label: "user_id" },
        { id: "to-a", from: "router", to: "s1", kind: "data", label: "hash" },
        { id: "to-b", from: "router", to: "s2", kind: "data" },
        { id: "to-c", from: "router", to: "s3", kind: "data" }
      ],
      learn: [
        "Giải thích sharding khác replication ở điểm nào.",
        "Chọn shard key dựa trên truy vấn và phân bố dữ liệu.",
        "Nhận diện hot shard và cách giảm nhiệt.",
        "Hiểu resharding và vai trò của consistent hashing."
      ],
      steps: [
        {
          short: "Vì sao shard",
          type: "TỔNG QUAN",
          title: "Khi một database không đủ",
          body: "Replication nhân bản cùng một tập dữ liệu; sharding chia tập dữ liệu thành các phần khác nhau. Mỗi shard giữ một phần dữ liệu và có thể nằm trên một máy riêng, giúp vượt giới hạn dung lượng và ghi của một node.",
          focus: ["app", "router", "s1", "s2"],
          edges: ["in", "to-b"],
          metrics: { shards: "3", hot: "5%", rebalance: "—", p95: "80 ms" },
          changes: ["Dữ liệu được chia theo khóa", "Mỗi shard là một phần độc lập"],
          note: "Sharding làm truy vấn toàn cục khó hơn. Chỉ shard khi dữ liệu hoặc tải ghi thật sự vượt năng lực một database."
        },
        {
          short: "Shard key",
          type: "KỸ THUẬT",
          title: "Chọn khóa quyết định tất cả",
          body: "Shard key là trường dùng để quyết định dữ liệu nằm ở shard nào. Khóa tốt phân bố đều, xuất hiện trong hầu hết truy vấn và ít thay đổi. Với ứng dụng người dùng, <code>user_id</code> thường là lựa chọn tự nhiên.",
          focus: ["app", "router", "s1"],
          edges: ["in", "to-a"],
          metrics: { shards: "3", hot: "5%", rebalance: "—", p95: "80 ms" },
          changes: ["Chọn user_id làm shard key", "Một truy vấn thường chạm một shard"],
          note: "Nếu chọn khóa theo thời gian, dữ liệu mới có thể dồn hết vào một shard nóng. Hãy kiểm tra phân bố trước khi chốt."
        },
        {
          short: "Hash",
          type: "KỸ THUẬT",
          title: "Hash để chia đều",
          body: "Router tính <code>hash(user_id) % N</code> để chọn shard. Cách này phân bố đều nhưng khi N thay đổi, gần như toàn bộ khóa phải di chuyển. Consistent hashing hoặc virtual nodes giảm số khóa phải di chuyển khi thêm máy.",
          focus: ["router", "s1", "s2", "s3"],
          edges: ["in", "to-a", "to-b", "to-c"],
          metrics: { shards: "3", hot: "5%", rebalance: "—", p95: "80 ms" },
          changes: ["Hash phân bố đều", "Thêm shard sẽ cần reshard"],
          note: "Range sharding dễ hiểu và hỗ trợ truy vấn khoảng, nhưng dễ tạo hot shard. Hash sharding đều hơn nhưng khó truy vấn range."
        },
        {
          short: "Hot shard",
          type: "CẢNH BÁO",
          tone: "warn",
          title: "Một shard nóng, cả hệ thống chậm",
          body: "Nếu một người dùng, một tenant hoặc một khóa quá lớn, shard chứa nó nhận phần lớn tải. Thêm shard không giúp gì vì dữ liệu vẫn nằm ở một chỗ. Cần tách khóa, salting hoặc chia nhỏ shard nóng.",
          focus: ["router", "s2"],
          edges: ["in", "to-b"],
          metrics: { shards: "3", hot: "45%", rebalance: "—", p95: "600 ms" },
          warn: ["s2"],
          changes: ["Shard B nhận 45% tải", "p95 tăng mạnh"],
          note: "Hot shard là lý do phải theo dõi phân bố theo tenant/key, không chỉ nhìn CPU trung bình của toàn cụm."
        },
        {
          short: "Reshard",
          type: "KỸ THUẬT",
          title: "Chia lại mà không sập",
          body: "Khi thêm shard, dữ liệu phải di chuyển. Cách an toàn là đọc/ghi kép trong giai đoạn chuyển đổi, kiểm tra đối soát rồi mới chuyển hẳn. Consistent hashing giúp chỉ di chuyển một phần khóa thay vì toàn bộ.",
          focus: ["router", "s1", "s2", "s3"],
          edges: ["in", "to-a", "to-b", "to-c"],
          metrics: { shards: "3 → 6", hot: "8%", rebalance: "Đang chạy", p95: "120 ms" },
          changes: ["Chia shard B thành hai", "Double-write trong lúc chuyển"],
          note: "Resharding là thao tác vận hành nguy hiểm. Cần có kế hoạch rollback và kiểm tra tính đúng đắn trước khi xóa dữ liệu cũ."
        },
        {
          short: "Tóm tắt",
          type: "TÓM TẮT",
          tone: "final",
          title: "Sharding là quyết định dài hạn",
          body: "Shard key ảnh hưởng đến mọi truy vấn, đến khả năng mở rộng và đến chi phí vận hành. Chọn khóa phân bố đều, gần với truy vấn chính và có kế hoạch reshard trước khi buộc phải làm.",
          focus: "all",
          edges: "all",
          metrics: { shards: "3 → 6", hot: "8%", rebalance: "Đang chạy", p95: "120 ms" },
          changes: ["Shard key là quyết định kiến trúc", "Theo dõi hot shard liên tục"],
          note: "Tiếp theo: tách việc nặng ra khỏi request bằng message queue."
        }
      ]
    },

    "message-queue": {
      id: "message-queue",
      module: "async",
      title: "Message queue",
      shortTitle: "Message queue",
      subtitle: "Queue cho phép API trả lời trước rồi xử lý việc nặng phía sau. Nó tăng khả năng chịu tải, nhưng mở ra các câu hỏi về retry, thứ tự và xử lý trùng lặp.",
      blurb: "Tách producer và consumer để việc nặng không chặn người dùng.",
      duration: "11 phút",
      level: "Trung cấp",
      tags: ["producer", "consumer", "retry", "DLQ", "idempotency"],
      metrics: [
        { key: "depth", label: "Queue depth", tone: "violet" },
        { key: "throughput", label: "Throughput", tone: "blue" },
        { key: "retry", label: "Retry", tone: "coral" },
        { key: "p95", label: "p95", tone: "green" }
      ],
      nodes: [
        { id: "api", type: "server", x: 55, y: 210, w: 140, h: 64, label: "API", sub: "trả lời nhanh" },
        { id: "queue", type: "queue", x: 260, y: 210, w: 150, h: 64, label: "Queue", sub: "bền vững" },
        { id: "w1", type: "worker", x: 485, y: 62, w: 130, h: 64, label: "Worker 1", sub: "xử lý" },
        { id: "w2", type: "worker", x: 485, y: 210, w: 130, h: 64, label: "Worker 2", sub: "xử lý" },
        { id: "w3", type: "worker", x: 485, y: 358, w: 130, h: 64, label: "Worker 3", sub: "xử lý" },
        { id: "db", type: "db", x: 715, y: 210, w: 130, h: 64, label: "Database", sub: "kết quả" },
        { id: "dlq", type: "store", x: 715, y: 62, w: 130, h: 64, label: "DLQ", sub: "thư chết" }
      ],
      edges: [
        { id: "enqueue", from: "api", to: "queue", kind: "request", label: "enqueue" },
        { id: "q1", from: "queue", to: "w1", kind: "data" },
        { id: "q2", from: "queue", to: "w2", kind: "data" },
        { id: "q3", from: "queue", to: "w3", kind: "data" },
        { id: "w1db", from: "w1", to: "db", kind: "data", bow: -8 },
        { id: "w2db", from: "w2", to: "db", kind: "data", label: "ghi" },
        { id: "w3db", from: "w3", to: "db", kind: "data", bow: 8 },
        { id: "fail", from: "w2", to: "dlq", kind: "data", label: "fail" }
      ],
      learn: [
        "Giải thích lợi ích của việc trả lời trước, xử lý sau.",
        "Phân biệt at-least-once và exactly-once trong thực tế.",
        "Thiết kế retry có kiểm soát và dead-letter queue.",
        "Nhận diện backpressure khi worker không theo kịp."
      ],
      steps: [
        {
          short: "Trả lời trước",
          type: "TỔNG QUAN",
          title: "Không bắt người dùng chờ việc nặng",
          body: "API nhận yêu cầu, ghi một message vào queue rồi trả lời ngay. Worker xử lý sau: gửi email, tạo thumbnail, cập nhật thống kê. Người dùng thấy phản hồi nhanh; hệ thống có thêm một bước trung gian.",
          focus: ["api", "queue"],
          edges: ["enqueue"],
          metrics: { depth: "120", throughput: "4.000/s", retry: "0", p95: "35 ms" },
          changes: ["API không chờ xử lý xong", "Message được lưu bền vững"],
          note: "Queue không làm việc nặng biến mất. Nó chỉ chuyển việc đó ra khỏi đường đi trực tiếp của request."
        },
        {
          short: "Enqueue",
          type: "KỸ THUẬT",
          title: "Một message, một lời hứa",
          body: "Producer gửi message và nhận xác nhận từ queue. Message cần đủ thông tin để worker xử lý độc lập: loại việc, ID, dữ liệu cần thiết. Queue giữ message cho đến khi có worker xác nhận đã xử lý.",
          focus: ["api", "queue"],
          edges: ["enqueue"],
          metrics: { depth: "120", throughput: "4.000/s", retry: "0", p95: "35 ms" },
          changes: ["+ Message được ghi vào queue", "Có thể retry nếu worker lỗi"],
          note: "Đừng đưa toàn bộ object lớn vào message. Hãy đưa ID và để worker đọc dữ liệu cần thiết từ nguồn."
        },
        {
          short: "Worker",
          type: "KỸ THUẬT",
          title: "Worker xử lý và ack",
          body: "Worker lấy message, thực hiện công việc rồi ack để queue xóa message. Nếu worker chết trước khi ack, message có thể được giao lại. Vì vậy worker phải <strong>idempotent</strong>: xử lý cùng một message hai lần không tạo ra kết quả sai.",
          focus: ["queue", "w1", "w2", "w3", "db"],
          edges: ["q1", "q2", "q3", "w1db", "w2db", "w3db"],
          metrics: { depth: "80", throughput: "4.000/s", retry: "0,1%", p95: "42 ms" },
          changes: ["+ Worker xử lý song song", "Ack sau khi hoàn tất"],
          note: "At-least-once là mô hình phổ biến. Hãy dùng khóa idempotency hoặc kiểm tra trạng thái trước khi ghi."
        },
        {
          short: "Retry & DLQ",
          type: "CẢNH BÁO",
          tone: "warn",
          title: "Thất bại phải có đường ra",
          body: "Lỗi tạm thời nên được retry với exponential backoff. Lỗi lặp lại mãi mãi cần được đưa vào dead-letter queue để điều tra, thay vì quay vòng và chặn cả queue. Retry không có giới hạn là một cách tự tạo sự cố.",
          focus: ["w2", "dlq"],
          edges: ["q2", "fail"],
          metrics: { depth: "140", throughput: "3.800/s", retry: "1,2%", p95: "60 ms" },
          warn: ["w2"],
          changes: ["+ Retry có backoff", "Message lỗi vào DLQ"],
          note: "DLQ cần được theo dõi. Một DLQ đầy mà không ai xem nghĩa là dữ liệu đang mất dần trong im lặng."
        },
        {
          short: "Backpressure",
          type: "CẢNH BÁO",
          tone: "warn",
          title: "Khi worker không theo kịp",
          body: "Nếu tốc độ đưa vào lớn hơn tốc độ xử lý, queue depth tăng. Một lúc nào đó, độ trễ từ lúc gửi đến lúc hoàn tất trở nên vô nghĩa. Cần scale worker, giới hạn tốc độ producer hoặc giảm tần suất công việc.",
          focus: ["queue", "w1", "w2", "w3"],
          edges: ["enqueue", "q1", "q2", "q3"],
          metrics: { depth: "12.000", throughput: "4.000/s", retry: "0,5%", p95: "400 ms" },
          warn: ["queue"],
          changes: ["Queue depth tăng liên tục", "Thời gian chờ cuối tăng"],
          note: "Queue không phải bãi rác vô hạn. Hãy đặt cảnh báo theo tuổi message, không chỉ theo độ dài queue."
        },
        {
          short: "Tóm tắt",
          type: "TÓM TẮT",
          tone: "final",
          title: "Bất đồng bộ là một hợp đồng",
          body: "Queue giúp giảm latency và tăng khả năng chịu tải, nhưng yêu cầu idempotency, retry có kiểm soát, DLQ và giám sát độ trễ. Hãy xem message như một lời hứa sẽ được xử lý, không phải một lời gọi hàm.",
          focus: "all",
          edges: "all",
          metrics: { depth: "80", throughput: "4.000/s", retry: "0,1%", p95: "42 ms" },
          changes: ["Tách producer khỏi consumer", "Đo tuổi message và DLQ"],
          note: "Tiếp theo: ghép các mảnh đã học vào một hệ thống URL shortener thật."
        }
      ]
    },

    "url-shortener": {
      id: "url-shortener",
      module: "systems",
      title: "Thiết kế URL shortener",
      shortTitle: "URL shortener",
      subtitle: "Bài toán tưởng nhỏ nhưng chứa đủ mọi câu hỏi: sinh ID, đọc cực nhanh, cache, ghi mapping, chống trùng và xử lý analytics mà không chặn redirect.",
      blurb: "Một bài system design kinh điển, đọc nhiều ghi ít.",
      duration: "15 phút",
      level: "Tổng hợp",
      tags: ["base62", "ID generator", "redirect", "analytics"],
      metrics: [
        { key: "ratio", label: "Đọc : ghi", tone: "violet" },
        { key: "hit", label: "Cache hit", tone: "green" },
        { key: "p95", label: "p95", tone: "blue" },
        { key: "qps", label: "Read QPS", tone: "coral" }
      ],
      nodes: [
        { id: "client", type: "client", x: 40, y: 210, w: 130, h: 64, label: "Client", sub: "click link" },
        { id: "api", type: "server", x: 220, y: 210, w: 150, h: 64, label: "Short API", sub: "tạo / chuyển" },
        { id: "idgen", type: "worker", x: 220, y: 70, w: 150, h: 64, label: "ID generator", sub: "counter / Snowflake" },
        { id: "cache", type: "cache", x: 430, y: 108, w: 140, h: 64, label: "Cache", sub: "mã → URL" },
        { id: "db", type: "db", x: 430, y: 350, w: 140, h: 64, label: "Database", sub: "mã → URL" },
        { id: "queue", type: "queue", x: 640, y: 70, w: 140, h: 64, label: "Queue", sub: "click events" },
        { id: "worker", type: "worker", x: 640, y: 350, w: 140, h: 64, label: "Worker", sub: "thống kê" }
      ],
      edges: [
        { id: "in", from: "client", to: "api", kind: "request", label: "request" },
        { id: "gen", from: "api", to: "idgen", kind: "request", label: "sinh mã", bow: 13 },
        { id: "gen-back", from: "idgen", to: "api", kind: "response", label: "base62", bow: -13 },
        { id: "lookup", from: "api", to: "cache", kind: "request", label: "lookup", bow: 14 },
        { id: "hit", from: "cache", to: "api", kind: "response", label: "hit", bow: -14 },
        { id: "miss", from: "api", to: "db", kind: "request", label: "miss / ghi", bow: -14 },
        { id: "data", from: "db", to: "api", kind: "response", label: "URL", bow: 14 },
        { id: "click", from: "api", to: "queue", kind: "data", label: "click" },
        { id: "consume", from: "queue", to: "worker", kind: "data" },
        { id: "stats", from: "worker", to: "db", kind: "data", label: "stats", bow: 55 }
      ],
      learn: [
        "Thiết kế luồng tạo mã và luồng redirect riêng biệt.",
        "Sinh mã base62 không trùng và lưu mapping bền vững.",
        "Đặt cache trước database cho đường đọc.",
        "Đẩy analytics sang queue để không chặn redirect."
      ],
      steps: [
        {
          short: "Bài toán",
          type: "TỔNG QUAN",
          title: "Đọc nhiều, ghi ít",
          body: "Một URL shortener nhận link dài, trả về link ngắn, và khi người dùng bấm vào link ngắn thì chuyển hướng. Tỉ lệ đọc/ghi thường khoảng <strong>100:1</strong>, nên đường đọc là nơi cần tối ưu trước.",
          focus: ["client", "api"],
          edges: ["in"],
          metrics: { ratio: "100 : 1", hit: "—", p95: "—", qps: "10k" },
          changes: ["Hai luồng: tạo và chuyển hướng", "Đọc là traffic chính"],
          note: "Đừng bắt đầu bằng sharding. Hãy bắt đầu bằng ước lượng, cache và đường đọc nhanh."
        },
        {
          short: "Sinh mã",
          type: "KỸ THUẬT",
          title: "Sinh mã ngắn",
          body: "Dùng bộ sinh ID tăng dần hoặc Snowflake, rồi mã hóa sang base62. Bảy ký tự base62 cho khoảng 3,5 nghìn tỉ mã. Cần đảm bảo không trùng, đặc biệt khi nhiều API server cùng sinh mã.",
          focus: ["api", "idgen"],
          edges: ["gen", "gen-back"],
          metrics: { ratio: "100 : 1", hit: "—", p95: "—", qps: "10k" },
          changes: ["+ Sinh ID duy nhất", "+ Mã hóa base62"],
          note: "ID tuần tự dễ đoán. Nếu cần bảo mật, thêm thành phần ngẫu nhiên hoặc ký link; đừng chỉ dựa vào độ dài mã."
        },
        {
          short: "Ghi mapping",
          type: "KỸ THUẬT",
          title: "Lưu mapping bền vững",
          body: "API ghi cặp <code>mã → URL gốc</code> vào database với ràng buộc duy nhất trên mã. Nếu ghi lỗi, có thể retry với mã mới. Đường ghi ít hơn nhiều so với đường đọc, nên có thể chấp nhận latency cao hơn một chút.",
          focus: ["api", "db"],
          edges: ["miss", "data"],
          metrics: { ratio: "100 : 1", hit: "—", p95: "12 ms", qps: "10k" },
          changes: ["+ Ghi mapping", "+ Ràng buộc duy nhất trên mã"],
          note: "Luôn kiểm tra trùng ở tầng lưu trữ, không chỉ ở tầng ứng dụng. Hai request đồng thời có thể cùng thấy một mã là trống."
        },
        {
          short: "Cache",
          type: "KỸ THUẬT",
          title: "Đọc: cache trước",
          body: "Khi redirect, API tra cache theo mã. Phần lớn link nóng nằm trong cache, nên request không cần chạm database. Với hit rate 95%, tải database giảm mạnh dù traffic đọc rất lớn.",
          focus: ["api", "cache"],
          edges: ["lookup", "hit"],
          metrics: { ratio: "100 : 1", hit: "95%", p95: "8 ms", qps: "10k" },
          changes: ["+ Cache lookup", "Phần lớn redirect không chạm DB"],
          note: "TTL của cache URL có thể dài vì mapping hiếm khi đổi. Nhưng nếu cho phép sửa/xóa link, cần invalidation rõ ràng."
        },
        {
          short: "Miss",
          type: "CẢNH BÁO",
          tone: "warn",
          title: "Cache miss và redirect",
          body: "Nếu mã không có trong cache, API đọc database rồi ghi lại cache, sau đó trả về redirect. Phản hồi nên là <code>302</code> nếu muốn thống kê mỗi lần click, hoặc <code>301</code> nếu chấp nhận trình duyệt cache vĩnh viễn.",
          focus: ["cache", "db"],
          edges: ["miss", "data"],
          metrics: { ratio: "100 : 1", hit: "95%", p95: "30 ms", qps: "10k" },
          warn: ["db"],
          changes: ["+ DB lookup", "+ Ghi lại cache"],
          note: "301 giảm tải nhưng làm mất một phần analytics. 302 linh hoạt hơn nhưng tăng traffic tới server."
        },
        {
          short: "Analytics",
          type: "KỸ THUẬT",
          title: "Đừng chặn redirect vì thống kê",
          body: "Mỗi click có thể cần ghi nhận thời gian, vị trí, referrer. Đừng ghi đồng bộ vào database trên đường redirect. Hãy đẩy event vào queue, worker xử lý sau và ghi vào kho phân tích.",
          focus: ["api", "queue", "worker"],
          edges: ["click", "consume"],
          metrics: { ratio: "100 : 1", hit: "96%", p95: "35 ms", qps: "20k" },
          changes: ["+ Click event vào queue", "Analytics xử lý bất đồng bộ"],
          note: "Analytics có thể chậm vài giây mà người dùng không thấy. Đó là đánh đổi hợp lý nếu sản phẩm chấp nhận."
        },
        {
          short: "Mở rộng",
          type: "KỸ THUẬT",
          title: "Khi traffic đọc tăng 100 lần",
          body: "Cache và read replica giúp mở rộng đường đọc. Khi dữ liệu lớn, shard theo mã hoặc theo hash của mã. Bộ sinh ID cần được thiết kế để không phụ thuộc một node duy nhất.",
          focus: "all",
          edges: ["in", "lookup", "hit", "miss", "data", "click", "consume"],
          metrics: { ratio: "100 : 1", hit: "98%", p95: "25 ms", qps: "100k" },
          changes: ["+ Read replica / shard", "+ CDN cho redirect tĩnh nếu phù hợp"],
          note: "Mỗi lớp mở rộng thêm một lớp vận hành. Hãy đo nút thắt thật trước khi thêm shard."
        },
        {
          short: "Tóm tắt",
          type: "TÓM TẮT",
          tone: "final",
          title: "Thiết kế theo đường đọc",
          body: "URL shortener là bài học về việc tối ưu đúng đường: cache cho đọc, ID generator cho ghi, queue cho analytics. Mọi thành phần đều có thể mở rộng độc lập nếu biên giới dữ liệu được định nghĩa rõ.",
          focus: "all",
          edges: "all",
          metrics: { ratio: "100 : 1", hit: "98%", p95: "25 ms", qps: "100k" },
          changes: ["Cache trước, DB sau", "Analytics tách khỏi redirect"],
          note: "Tiếp theo: chat — nơi kết nối dài, presence và thứ tự tin nhắn tạo ra bài toán khác."
        }
      ]
    },

    "chat": {
      id: "chat",
      module: "systems",
      title: "Thiết kế hệ thống chat",
      shortTitle: "Chat system",
      subtitle: "Chat không chỉ là gửi và nhận. Nó cần kết nối dài, trạng thái online, lưu lịch sử, fan-out và xử lý tin nhắn trùng khi client mất mạng rồi kết nối lại.",
      blurb: "Kết nối dài, fan-out và idempotency trong một hệ thống thật.",
      duration: "14 phút",
      level: "Tổng hợp",
      tags: ["WebSocket", "presence", "fan-out", "idempotency"],
      metrics: [
        { key: "connections", label: "Kết nối", tone: "blue" },
        { key: "delivery", label: "Giao tin", tone: "green" },
        { key: "order", label: "Thứ tự", tone: "violet" },
        { key: "p95", label: "p95", tone: "coral" }
      ],
      nodes: [
        { id: "c1", type: "client", x: 45, y: 95, w: 130, h: 64, label: "Client A", sub: "đang online" },
        { id: "c2", type: "client", x: 45, y: 345, w: 130, h: 64, label: "Client B", sub: "điện thoại" },
        { id: "gw", type: "gateway", x: 230, y: 215, w: 150, h: 64, label: "Gateway", sub: "WebSocket" },
        { id: "presence", type: "presence", x: 440, y: 78, w: 140, h: 64, label: "Presence", sub: "online / offline" },
        { id: "msg", type: "server", x: 440, y: 215, w: 150, h: 64, label: "Message service", sub: "nhận tin" },
        { id: "queue", type: "queue", x: 630, y: 215, w: 140, h: 64, label: "Queue", sub: "fan-out" },
        { id: "fanout", type: "gateway", x: 630, y: 78, w: 140, h: 64, label: "Fan-out", sub: "đẩy tới client" },
        { id: "db", type: "db", x: 630, y: 355, w: 140, h: 64, label: "Storage", sub: "lịch sử chat" }
      ],
      edges: [
        { id: "c1in", from: "c1", to: "gw", kind: "request", label: "kết nối", bow: -8 },
        { id: "c2in", from: "c2", to: "gw", kind: "request", bow: 8 },
        { id: "presence-e", from: "gw", to: "presence", kind: "data" },
        { id: "send", from: "gw", to: "msg", kind: "request", label: "gửi" },
        { id: "persist", from: "msg", to: "db", kind: "data", label: "lưu" },
        { id: "enqueue", from: "msg", to: "queue", kind: "data" },
        { id: "fan", from: "queue", to: "fanout", kind: "data" },
        { id: "deliver", from: "fanout", to: "gw", kind: "response", label: "deliver" },
        { id: "push1", from: "gw", to: "c1", kind: "response", label: "đẩy", bow: 14 },
        { id: "push2", from: "gw", to: "c2", kind: "response", bow: -14 }
      ],
      learn: [
        "Giải thích vì sao chat dùng kết nối dài thay vì polling.",
        "Thiết kế luồng lưu tin trước, fan-out sau.",
        "Xử lý trạng thái online/offline và giao tin khi mất kết nối.",
        "Đảm bảo thứ tự trong hội thoại và chống trùng tin nhắn."
      ],
      steps: [
        {
          short: "Kết nối",
          type: "TỔNG QUAN",
          title: "Giữ kết nối thay vì hỏi liên tục",
          body: "Chat dùng WebSocket để server có thể đẩy tin ngay khi có sự kiện. Mỗi client giữ một kết nối dài tới gateway. Gateway không cần biết toàn bộ lịch sử; nó chỉ cần biết client đang ở đâu và chuyển tin đúng hướng.",
          focus: ["c1", "c2", "gw"],
          edges: ["c1in", "c2in"],
          metrics: { connections: "50k", delivery: "—", order: "—", p95: "60 ms" },
          changes: ["+ WebSocket", "Server có thể đẩy dữ liệu"],
          note: "Polling vẫn hữu ích cho một số trường hợp. Với chat, kết nối dài giảm độ trễ và giảm traffic hỏi rỗng."
        },
        {
          short: "Gửi tin",
          type: "KỸ THUẬT",
          title: "Client gửi tin qua gateway",
          body: "Tin nhắn đi từ client tới gateway, kèm ID tạm để client hiển thị ngay. Gateway chuyển tới message service. Message service kiểm tra quyền, gán ID và thời gian chính thức rồi xác nhận lại cho người gửi.",
          focus: ["gw", "msg"],
          edges: ["send"],
          metrics: { connections: "50k", delivery: "—", order: "—", p95: "60 ms" },
          changes: ["+ Message service", "Tin có ID tạm ở client"],
          note: "Client nên hiển thị tin ngay (optimistic UI), nhưng phải đánh dấu đang gửi cho đến khi nhận ack."
        },
        {
          short: "Lưu trước",
          type: "KỸ THUẬT",
          title: "Lưu trước, fan-out sau",
          body: "Message service ghi tin vào storage và đẩy một event vào queue. Chỉ sau khi tin đã bền vững mới fan-out. Nếu fan-out lỗi, worker có thể thử lại mà không làm mất tin.",
          focus: ["msg", "queue", "db"],
          edges: ["persist", "enqueue"],
          metrics: { connections: "50k", delivery: "—", order: "—", p95: "80 ms" },
          changes: ["+ Ghi storage", "+ Event fan-out vào queue"],
          note: "Không fan-out trước khi lưu. Một tin đã tới người nhận nhưng không có trong lịch sử sẽ gây lệch trạng thái."
        },
        {
          short: "Fan-out",
          type: "KỸ THUẬT",
          title: "Đẩy tới người nhận",
          body: "Fan-out xác định những người cần nhận tin, tìm gateway đang giữ kết nối của họ và đẩy qua. Với nhóm lớn, fan-out có thể chia theo batch hoặc theo shard để tránh một worker phải gửi hàng triệu tin.",
          focus: ["queue", "fanout", "gw", "c1", "c2"],
          edges: ["fan", "deliver", "push1", "push2"],
          metrics: { connections: "50k", delivery: "99,9%", order: "—", p95: "110 ms" },
          changes: ["+ Fan-out", "+ Gateway đẩy tới client"],
          note: "Fan-out là nơi dễ tạo tải lớn nhất. Với nhóm đông, hãy xem xét mô hình pull hoặc phân phối theo shard."
        },
        {
          short: "Presence",
          type: "KỸ THUẬT",
          title: "Online hay offline?",
          body: "Presence theo dõi client nào đang online. Mỗi kết nối có heartbeat; khi mất heartbeat, trạng thái chuyển offline sau một khoảng. Nếu người nhận offline, tin được lưu và gửi lại khi họ kết nối, hoặc đẩy qua push notification.",
          focus: ["gw", "presence"],
          edges: ["presence-e"],
          metrics: { connections: "50k", delivery: "99,9%", order: "—", p95: "100 ms" },
          changes: ["+ Heartbeat", "+ Trạng thái offline có TTL"],
          note: "Presence là dữ liệu tạm thời. Đừng coi nó là nguồn sự thật cho việc giao tin; storage và queue mới đảm bảo tin không mất."
        },
        {
          short: "Thứ tự",
          type: "CẢNH BÁO",
          tone: "warn",
          title: "Thứ tự và tin trùng",
          body: "Mạng có thể giao lại hoặc đảo thứ tự. Hệ thống thường đảm bảo thứ tự trong từng hội thoại bằng sequence number, và dùng at-least-once kèm idempotency ở client/server. Đừng hứa exactly-once nếu chưa chứng minh được.",
          focus: ["msg", "db"],
          edges: ["persist"],
          metrics: { connections: "50k", delivery: "99,9%", order: "Theo hội thoại", p95: "95 ms" },
          warn: ["msg"],
          changes: ["+ Sequence number", "+ Dedupe theo message ID"],
          note: "Tin nhắn trùng sau khi reconnect là triệu chứng phổ biến. Hãy dedupe ở client và server, đừng chỉ tăng timeout."
        },
        {
          short: "Tóm tắt",
          type: "TÓM TẮT",
          tone: "final",
          title: "Chat là bài toán trạng thái phân tán",
          body: "Gateway giữ kết nối, message service xử lý, storage và queue đảm bảo bền vững, fan-out đưa tin tới người nhận. Thứ tự và idempotency không tự xuất hiện; chúng phải được thiết kế từ đầu.",
          focus: "all",
          edges: "all",
          metrics: { connections: "50k", delivery: "99,9%", order: "Theo hội thoại", p95: "95 ms" },
          changes: ["Tin bền vững trước fan-out", "Đo delivery và duplicate rate"],
          note: "Bạn đã đi hết phần nền tảng. Hãy thử Design Lab để tự ghép pipeline và nhìn nút thắt xuất hiện, rồi sang module Giao hàng để đưa thay đổi ra production."
        }
      ]
    }
  });

  SL.practice = [
    {
      id: "p1",
      tag: "Chẩn đoán",
      title: "Database quá tải vì đọc",
      scenario: "Một trang thương mại có 90% traffic là đọc. Database đang ở 95% CPU, cache hit rate chỉ 20%, p95 đã lên 800 ms. Ứng dụng đã chạy 4 app server.",
      metrics: [
        { label: "DB CPU", value: "95%", danger: true },
        { label: "Đọc", value: "90%" },
        { label: "Cache hit", value: "20%", danger: true },
        { label: "p95", value: "800 ms", danger: true }
      ],
      options: [
        "Thêm 4 app server nữa để chia tải",
        "Thêm một lớp cache cho các truy vấn đọc nóng trước database",
        "Tăng timeout của database lên 30 giây",
        "Chuyển toàn bộ ứng dụng sang NoSQL ngay lập tức"
      ],
      correct: 1,
      explain: "App server không phải nút thắt; database đang chịu traffic đọc với hit rate thấp. Cache các truy vấn nóng là thay đổi có tác động lớn nhất và ít rủi ro nhất. Thêm app server chỉ đẩy thêm request vào database đang quá tải."
    },
    {
      id: "p2",
      tag: "Mở rộng",
      title: "Flash sale và một app server",
      scenario: "Chiến dịch flash sale đưa lưu lượng lên 12.000 RPS. Ứng dụng vốn stateless, nhưng toàn bộ request đang dồn vào một app server ở 98% CPU. Database chỉ chịu 30% tải.",
      metrics: [
        { label: "RPS", value: "12.000", danger: true },
        { label: "App CPU", value: "98%", danger: true },
        { label: "DB CPU", value: "30%" },
        { label: "Server", value: "1" }
      ],
      options: [
        "Thêm index cho database",
        "Thêm load balancer và 3–4 app server, giữ session ngoài server",
        "Giảm TTL cache xuống 1 giây",
        "Tăng kích thước ổ đĩa của app server"
      ],
      correct: 1,
      explain: "Nút thắt nằm ở tầng app, không phải database. Vì ứng dụng stateless, có thể nhân bản app server và đặt load balancer phía trước. Đây là cách mở rộng ngang đúng chỗ."
    },
    {
      id: "p3",
      tag: "Latency",
      title: "p50 đẹp, p95 tệ",
      scenario: "Hệ thống xử lý 6.000 RPS, p50 chỉ 90 ms nhưng p95 là 2,1 giây. Hàng đợi nội bộ đang tăng dần và tất cả server ở mức 100% công suất trong giờ cao điểm.",
      metrics: [
        { label: "RPS", value: "6.000" },
        { label: "p50", value: "90 ms" },
        { label: "p95", value: "2,1 s", danger: true },
        { label: "Util", value: "100%", danger: true }
      ],
      options: [
        "Tăng timeout để request chờ lâu hơn",
        "Thêm server và đặt giới hạn hàng đợi/lưu lượng",
        "Nén ảnh trên trang chủ",
        "Đổi DNS sang nhà cung cấp khác"
      ],
      correct: 1,
      explain: "p95 tăng vọt khi utilization chạm 100% là dấu hiệu quá tải, không phải lỗi timeout. Cần thêm năng lực và bảo vệ hệ thống bằng giới hạn tải. Tăng timeout chỉ làm request chờ lâu hơn và giữ kết nối lâu hơn."
    },
    {
      id: "p4",
      tag: "Dữ liệu",
      title: "URL shortener tăng tải đọc",
      scenario: "Một dịch vụ rút gọn link có 100.000 read/s và 1.000 write/s. Cache hit 98%, database read replica hiện tại đã dùng 70% CPU. Bạn cần tăng khả năng đọc mà vẫn giữ đường ghi đơn giản.",
      metrics: [
        { label: "Read", value: "100k/s", danger: true },
        { label: "Write", value: "1k/s" },
        { label: "Cache hit", value: "98%" },
        { label: "Replica CPU", value: "70%" }
      ],
      options: [
        "Shard database theo mã ngay lập tức",
        "Thêm read replica và mở rộng cache/edge cho đường đọc",
        "Chuyển toàn bộ sang NoSQL",
        "Tăng thời gian timeout của redirect"
      ],
      correct: 1,
      explain: "Đường đọc đang là ứng viên rõ ràng cho scale out. Thêm replica và cache/edge giữ đường ghi hiện tại đơn giản. Sharding là bước nặng hơn, chỉ nên làm khi dữ liệu hoặc ghi thật sự vượt giới hạn."
    },
    {
      id: "p5",
      tag: "Bất đồng bộ",
      title: "Analytics làm chậm checkout",
      scenario: "Cứ mỗi đơn hàng, API vừa ghi giao dịch vừa ghi event analytics vào cùng database. Giờ cao điểm, truy vấn analytics làm p95 của checkout tăng từ 200 ms lên 1,4 giây.",
      metrics: [
        { label: "Checkout p95", value: "1,4 s", danger: true },
        { label: "Đơn hàng", value: "2k/s" },
        { label: "Analytics", value: "đồng bộ", danger: true },
        { label: "DB", value: "dùng chung" }
      ],
      options: [
        "Cache toàn bộ trang checkout",
        "Đẩy event analytics vào queue và xử lý bằng worker/read replica riêng",
        "Tăng CPU cho database",
        "Xóa toàn bộ dữ liệu analytics cũ"
      ],
      correct: 1,
      explain: "Analytics không cần nằm trên đường đi của giao dịch. Đưa event vào queue và xử lý ở worker hoặc kho dữ liệu riêng giúp cô lập tải. Cache checkout có thể gây sai dữ liệu và không giải quyết đường ghi."
    },
    {
      id: "p6",
      tag: "Chat",
      title: "Tin nhắn bị gửi trùng",
      scenario: "Sau khi mất mạng và kết nối lại, một số người dùng thấy cùng một tin nhắn xuất hiện hai lần. Hệ thống đang dùng at-least-once delivery và client tự gửi lại tin chưa được ack.",
      metrics: [
        { label: "Delivery", value: "at-least-once" },
        { label: "Duplicate", value: "1,8%", danger: true },
        { label: "Reconnect", value: "cao" },
        { label: "Order", value: "theo hội thoại" }
      ],
      options: [
        "Chuyển sang exactly-once bằng cách tăng timeout",
        "Dùng message ID/idempotency key và dedupe ở client lẫn server",
        "Tắt tính năng gửi lại khi mất mạng",
        "Chuyển toàn bộ chat sang polling mỗi giây"
      ],
      correct: 1,
      explain: "At-least-once nghĩa là phải chấp nhận khả năng trùng và xử lý bằng idempotency. Message ID ổn định giúp cả client và server loại bỏ bản sao. Exactly-once thực sự rất khó và không đạt được chỉ bằng timeout."
    }
  ];

  SL.cheatsheets = [
    {
      id: "numbers",
      num: "01",
      title: "Số liệu độ trễ",
      intro: "Các con số tham khảo để bạn không đánh giá sai bậc độ lớn. Đây là số liệu điển hình, không phải cam kết của mọi hệ thống.",
      cards: [
        {
          title: "Bảng độ trễ tham khảo",
          wide: true,
          html: '<table class="cheat-table"><thead><tr><th>Thao tác</th><th>Thời gian</th><th>Ghi chú</th></tr></thead><tbody><tr><td><b>L1 cache</b></td><td class="mono">~0,5 ns</td><td>Truy cập cực nhanh, trong CPU.</td></tr><tr><td><b>RAM</b></td><td class="mono">~100 ns</td><td>Nhanh hơn SSD khoảng 1.000 lần.</td></tr><tr><td><b>SSD đọc ngẫu nhiên</b></td><td class="mono">~100 µs</td><td>Tùy thiết bị và cache.</td></tr><tr><td><b>Mạng trong cùng datacenter</b></td><td class="mono">~0,5 ms</td><td>Round trip điển hình.</td></tr><tr><td><b>Cross-region</b></td><td class="mono">~100–200 ms</td><td>Phụ thuộc khoảng cách và tuyến cáp.</td></tr><tr><td><b>Truy vấn DB đơn giản</b></td><td class="mono">~1–20 ms</td><td>Index tốt, dữ liệu nóng.</td></tr></tbody></table>'
        },
        {
          title: "Đọc bảng này thế nào",
          html: '<p>Từ RAM đến SSD chênh khoảng 1.000 lần. Từ SSD đến cross-region chênh thêm khoảng 1.000 lần. Vì vậy, <b>tránh gọi mạng không cần thiết</b> thường hiệu quả hơn tối ưu code vài micro-giây.</p><div class="check-list"><span>Ưu tiên giảm số round trip.</span><span>Cache dữ liệu nóng trước khi tối ưu CPU.</span><span>Đừng đặt cross-region call trên đường đi đồng bộ.</span></div>'
        }
      ]
    },
    {
      id: "availability",
      num: "02",
      title: "Độ sẵn sàng",
      intro: "Một con số 99,9% nghe rất cao cho đến khi bạn quy đổi ra thời gian chết mỗi năm.",
      cards: [
        {
          title: "Bảng quy đổi nines",
          wide: true,
          html: '<table class="cheat-table"><thead><tr><th>Mức</th><th>Sẵn sàng</th><th>Downtime / năm</th><th>Downtime / tháng</th></tr></thead><tbody><tr><td>Hai nines</td><td class="mono">99%</td><td>3,65 ngày</td><td>~7,3 giờ</td></tr><tr><td>Ba nines</td><td class="mono">99,9%</td><td>8,77 giờ</td><td>~43,8 phút</td></tr><tr><td>Bốn nines</td><td class="mono">99,99%</td><td>52,6 phút</td><td>~4,4 phút</td></tr><tr><td>Năm nines</td><td class="mono">99,999%</td><td>5,26 phút</td><td>~26 giây</td></tr></tbody></table>'
        },
        {
          title: "Máy tính downtime",
          html: '<div class="calc" data-calc="availability"><div class="calc-field"><label>Mức sẵn sàng</label><select id="availSelect"><option value="99">99%</option><option value="99.9" selected>99,9%</option><option value="99.99">99,99%</option><option value="99.999">99,999%</option></select></div><div class="calc-out" id="availOut"><span>Downtime mỗi năm</span><b>8,77 giờ</b><small>≈ 43,8 phút mỗi tháng</small></div></div>',
          wide: false
        }
      ]
    },
    {
      id: "capacity",
      num: "03",
      title: "Dung lượng",
      intro: "Ước lượng nhanh trước khi thiết kế. Những phép tính đơn giản này thường đủ để loại bỏ những kiến trúc quá nặng hoặc quá nhẹ.",
      cards: [
        {
          title: "Máy tính RPS",
          wide: true,
          html: '<div class="calc" data-calc="capacity"><div class="calc-grid"><div class="calc-field"><label>Người dùng hoạt động/ngày</label><input id="capDau" type="number" min="0" value="10000000" step="100000"></div><div class="calc-field"><label>Request / người / ngày</label><input id="capReq" type="number" min="0" value="20" step="1"></div><div class="calc-field"><label>Hệ số peak</label><input id="capPeak" type="number" min="1" max="100" value="5" step="0.5"></div><div class="calc-field"><label>Năng lực mỗi server (RPS)</label><input id="capServer" type="number" min="1" value="2000" step="100"></div></div><div class="calc-out" id="capOut"><span>Peak RPS</span><b>11.574</b><small>≈ 6 app server ở 2.000 RPS/server</small></div></div>'
        },
        {
          title: "Công thức gốc",
          html: '<div class="formula">avg_rps = DAU × req_per_user / <span class="hl">86.400</span><br>peak_rps = avg_rps × <span class="hl">peak_factor</span><br>servers = ceil(peak_rps / capacity_per_server)</div><p>Luôn cộng thêm biên an toàn. Nếu server chạy ở 100% công suất, latency sẽ tăng phi tuyến.</p>'
        }
      ]
    },
    {
      id: "storage",
      num: "04",
      title: "Lưu trữ",
      intro: "Dung lượng là một chiều khác của bài toán scale. Một phép nhân nhỏ cũng có thể cho ra hàng trăm TB.",
      cards: [
        {
          title: "Máy tính dung lượng",
          wide: true,
          html: '<div class="calc" data-calc="storage"><div class="calc-grid"><div class="calc-field"><label>Người dùng</label><input id="stoUsers" type="number" min="0" value="1000000" step="100000"></div><div class="calc-field"><label>Bản ghi / người</label><input id="stoItems" type="number" min="0" value="200" step="10"></div><div class="calc-field"><label>Kích thước / bản ghi (KB)</label><input id="stoSize" type="number" min="0" value="2" step="0.5"></div><div class="calc-field"><label>Hệ số nhân bản</label><input id="stoRepl" type="number" min="1" max="6" value="3" step="1"></div></div><div class="calc-out" id="stoOut"><span>Dung lượng ước tính</span><b>1,12 TB</b><small>Đã tính hệ số nhân bản 3×</small></div></div>'
        },
        {
          title: "Đừng quên",
          html: '<div class="check-list"><span>Index và metadata thường chiếm thêm 10–30%.</span><span>Backup và log cũng cần dung lượng.</span><span>Replication nhân dung lượng theo số bản sao.</span><span>Dữ liệu nóng và lạnh có thể dùng tầng lưu trữ khác nhau.</span></div>'
        }
      ]
    },
    {
      id: "cache",
      num: "05",
      title: "Cache",
      intro: "Chọn chiến lược cache theo dữ liệu và mức chấp nhận dữ liệu cũ, không chỉ theo tốc độ.",
      cards: [
        {
          title: "Các mẫu phổ biến",
          wide: true,
          html: '<table class="cheat-table"><thead><tr><th>Mẫu</th><th>Cách hoạt động</th><th>Dùng khi</th><th>Rủi ro</th></tr></thead><tbody><tr><td><b>Cache-aside</b></td><td>App đọc cache; miss thì đọc DB rồi ghi cache.</td><td>Phổ biến, dễ kiểm soát.</td><td>Dữ liệu cũ, stampede.</td></tr><tr><td><b>Read-through</b></td><td>Cache tự tải dữ liệu khi miss.</td><td>Muốn giấu logic cache khỏi app.</td><td>Khó kiểm soát hơn.</td></tr><tr><td><b>Write-through</b></td><td>Ghi cache và DB cùng lúc.</td><td>Cần dữ liệu mới tương đối.</td><td>Ghi chậm hơn.</td></tr><tr><td><b>Write-behind</b></td><td>Ghi cache trước, DB sau.</td><td>Ghi rất nhiều, chấp nhận rủi ro.</td><td>Mất dữ liệu nếu cache lỗi.</td></tr></tbody></table>'
        },
        {
          title: "Máy tính tải database",
          html: '<div class="calc" data-calc="cachehit"><div class="calc-field"><label>Traffic đọc (RPS)</label><input id="cacheRps" type="number" min="0" value="10000" step="100"></div><div class="calc-field"><label>Cache hit rate (%)</label><input id="cacheHit" type="number" min="0" max="100" value="90" step="1"></div><div class="calc-out" id="cacheOut"><span>Tải database còn lại</span><b>1.000 RPS</b><small>Giảm 90% so với không cache</small></div></div>'
        }
      ]
    },
    {
      id: "patterns",
      num: "06",
      title: "Mẫu & giao tiếp",
      intro: "Một bảng tra nhanh khi bạn đứng trước câu hỏi “nên dùng cái gì?”.",
      cards: [
        {
          title: "Chọn theo vấn đề",
          wide: true,
          html: '<table class="cheat-table"><thead><tr><th>Vấn đề</th><th>Mẫu thường dùng</th><th>Đánh đổi chính</th></tr></thead><tbody><tr><td>Nhiều app server</td><td><b>Load balancer + stateless</b></td><td>Cần session dùng chung, health check.</td></tr><tr><td>Đọc quá nhiều</td><td><b>Cache + read replica</b></td><td>Dữ liệu cũ, replication lag.</td></tr><tr><td>Việc nặng, không cần đồng bộ</td><td><b>Message queue + worker</b></td><td>Retry, trùng lặp, DLQ.</td></tr><tr><td>Dữ liệu vượt một máy</td><td><b>Sharding</b></td><td>Chọn khóa, reshard, truy vấn toàn cục.</td></tr><tr><td>Kết nối hai chiều, realtime</td><td><b>WebSocket</b></td><td>Giữ kết nối, presence, fan-out.</td></tr></tbody></table>'
        },
        {
          title: "Câu hỏi trước khi chọn",
          html: '<div class="check-list"><span>Nút thắt thật sự nằm ở đâu?</span><span>Dữ liệu cũ trong bao lâu là chấp nhận được?</span><span>Hệ thống có cần đúng tuyệt đối không?</span><span>Chi phí vận hành tăng thêm là bao nhiêu?</span><span>Đo bằng chỉ số nào sau khi triển khai?</span></div>'
        }
      ]
    }
  ];

  SL.lab = {
    components: {
      client: { label: "Người dùng", type: "client", latency: 1, capacity: 999999, cost: 0, tone: "blue", replicas: false },
      lb: { label: "Load balancer", type: "lb", latency: 2, capacity: 80000, cost: 25, tone: "coral", replicas: false },
      app: { label: "App server", type: "server", latency: 8, capacity: 2000, cost: 20, tone: "blue", replicas: true, maxReplicas: 8 },
      cache: { label: "Cache", type: "cache", latency: 2, capacity: 30000, cost: 30, tone: "yellow", replicas: false },
      db: { label: "Database", type: "db", latency: 15, capacity: 1500, cost: 80, tone: "green", replicas: true, maxReplicas: 6 },
      queue: { label: "Message queue", type: "queue", latency: 3, capacity: 30000, cost: 15, tone: "violet", replicas: false },
      worker: { label: "Worker", type: "worker", latency: 20, capacity: 1000, cost: 10, tone: "coral", replicas: true, maxReplicas: 8 },
      cdn: { label: "CDN", type: "cdn", latency: 5, capacity: 100000, cost: 10, tone: "green", replicas: false },
      gateway: { label: "Gateway", type: "gateway", latency: 5, capacity: 20000, cost: 20, tone: "coral", replicas: false }
    },
    presets: [
      { id: "blog", name: "Blog nhỏ", pipeline: ["client", "app", "db"], rps: 300, cacheHit: 0, replicas: { app: 1, db: 1 } },
      { id: "sale", name: "Flash sale", pipeline: ["client", "lb", "app", "cache", "db"], rps: 12000, cacheHit: 80, replicas: { app: 3, db: 2 } },
      { id: "media", name: "Ảnh & video", pipeline: ["client", "cdn", "app", "cache", "db"], rps: 7000, cacheHit: 70, replicas: { app: 4, db: 2 } },
      { id: "chat", name: "Chat", pipeline: ["client", "gateway", "queue", "worker", "db"], rps: 5000, cacheHit: 0, replicas: { worker: 6, db: 4 } },
      { id: "analytics", name: "Analytics", pipeline: ["client", "lb", "app", "queue", "worker", "db"], rps: 5000, cacheHit: 0, replicas: { app: 3, worker: 6, db: 4 } }
    ],
    defaults: { pipeline: ["client", "app", "db"], rps: 1200, cacheHit: 70, replicas: { app: 1, db: 1 } }
  };
})(window.SCALELAB);
