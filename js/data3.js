/* ScaleLab course data — phần 3: Git & CI/CD */
(function () {
  "use strict";

  const SL = window.SCALELAB;
  if (!SL) return;

  SL.modules.push({
    id: "delivery",
    num: "06",
    title: "Giao hàng",
    tone: "mint",
    blurb: "Đưa thay đổi từ máy lập trình viên ra production bằng một đường đi kiểm soát được.",
    lessons: ["commit-snapshot", "branch-merge", "merge-conflict", "ci-pipeline", "quality-gates", "deploy-rollback"]
  });

  Object.assign(SL.lessons, {
    "commit-snapshot": {
      id: "commit-snapshot",
      module: "delivery",
      title: "Commit là ảnh chụp",
      shortTitle: "Commit & nhánh",
      subtitle: "Git không lưu từng dòng thay đổi chồng lên nhau. Mỗi commit là một ảnh chụp toàn bộ cây tệp, trỏ tới commit cha; nhánh chỉ là chiếc nhãn di chuyển được.",
      blurb: "Hiểu đúng mô hình dữ liệu của Git trước khi dùng lệnh.",
      duration: "12 phút",
      level: "Nhập môn",
      tags: ["Git", "commit", "staging", "HEAD", "snapshot"],
      metrics: [
        { key: "staged", label: "Đã stage", tone: "yellow" },
        { key: "commits", label: "Commit", tone: "blue" },
        { key: "ref", label: "Nhãn", tone: "green" },
        { key: "head", label: "HEAD", tone: "violet" }
      ],
      nodes: [
        { id: "working", type: "code", x: 50, y: 330, w: 160, h: 64, label: "Working tree", sub: "tệp đang sửa" },
        { id: "index", type: "file", x: 250, y: 330, w: 150, h: 64, label: "Staging area", sub: "chuẩn bị commit" },
        { id: "c1", type: "commit", x: 450, y: 70, w: 120, h: 58, label: "C1", sub: "ảnh chụp cũ" },
        { id: "c2", type: "commit", x: 600, y: 70, w: 120, h: 58, label: "C2", sub: "cha của C3" },
        { id: "c3", type: "commit", x: 750, y: 70, w: 120, h: 58, label: "C3", sub: "ảnh chụp mới" },
        { id: "main", type: "branch", x: 750, y: 210, w: 120, h: 58, label: "main", sub: "nhãn nhánh" },
        { id: "head", type: "presence", x: 750, y: 350, w: 120, h: 58, label: "HEAD", sub: "đang ở đâu" }
      ],
      edges: [
        { id: "add", from: "working", to: "index", kind: "request", label: "git add" },
        { id: "commit", from: "index", to: "c3", kind: "request", label: "commit" },
        { id: "parent1", from: "c2", to: "c1", kind: "data", label: "cha", bow: 10 },
        { id: "parent2", from: "c3", to: "c2", kind: "data", label: "cha", bow: 10 },
        { id: "label", from: "main", to: "c3", kind: "data", label: "trỏ" },
        { id: "head-ref", from: "head", to: "main", kind: "data", label: "đang ở" }
      ],
      learn: [
        "Mô tả commit là ảnh chụp bất biến có con trỏ tới cha.",
        "Phân biệt working tree, staging area và commit.",
        "Giải thích nhánh và HEAD là các nhãn di chuyển, không phải bản sao thư mục.",
        "Biết khi nào lịch sử bị viết lại và vì sao reflog cứu được."
      ],
      steps: [
        {
          short: "Mô hình",
          type: "TỔNG QUAN",
          title: "Ảnh chụp, không phải bản vá",
          body: "Mỗi commit lưu một ảnh chụp cây tệp tại một thời điểm, kèm con trỏ tới commit cha. Git có thể tính lại diff giữa hai ảnh chụp, nhưng <strong>đơn vị lưu trữ là snapshot</strong>. Các tệp không đổi được chia sẻ giữa các commit để tiết kiệm chỗ.",
          focus: ["working", "index", "c1", "c2", "c3"],
          edges: "all",
          metrics: { staged: "2 tệp", commits: "3", ref: "main", head: "C3" },
          changes: ["Lịch sử là một đồ thị có hướng", "Mỗi commit có một mã băm riêng"],
          note: "Vì là ảnh chụp, commit không làm thay đổi commit cũ. Muốn sửa lịch sử, Git tạo ra commit mới rồi dời nhãn."
        },
        {
          short: "Staging",
          type: "KỸ THUẬT",
          title: "Chọn phần nào vào ảnh chụp",
          body: "Working tree là nơi bạn đang sửa. <code>git add</code> chép nội dung đã chọn vào staging area. Commit chỉ lấy những gì đang nằm ở staging, nên bạn có thể <strong>commit một phần thay đổi</strong> thay vì tất cả.",
          focus: ["working", "index"],
          edges: ["add"],
          metrics: { staged: "2 tệp", commits: "2", ref: "main", head: "C2" },
          changes: ["+ 2 tệp được đưa vào staging", "Working tree vẫn còn thay đổi khác"],
          note: "Dùng <code>git add -p</code> để chọn từng khối thay đổi. Staging là công cụ kể chuyện: mỗi commit nên là một ý rõ ràng."
        },
        {
          short: "Commit",
          type: "KỸ THUẬT",
          title: "Tạo ảnh chụp C3",
          body: "Khi chạy <code>git commit</code>, Git tạo ảnh chụp mới C3, ghi cha là C2, rồi dời nhãn <code>main</code> sang C3. Staging được làm sạch. Commit cũ không bị sửa; chỉ có nhãn di chuyển.",
          focus: ["index", "c2", "c3", "main"],
          edges: ["commit", "parent2", "label"],
          metrics: { staged: "0 tệp", commits: "3", ref: "C3", head: "C3" },
          changes: ["+ Commit C3", "Nhãn main dời sang C3"],
          note: "Mã băm của commit phụ thuộc nội dung cây, cha, tác giả, thời điểm và thông điệp. Đổi bất kỳ phần nào sẽ tạo mã mới."
        },
        {
          short: "Con trỏ cha",
          type: "KỸ THUẬT",
          title: "Lịch sử là một DAG",
          body: "Đi ngược từ C3 theo con trỏ cha sẽ tới C2 rồi C1. Các commit tạo thành đồ thị có hướng, không có vòng. Nhờ vậy Git có thể lần theo lịch sử, tìm tổ tiên chung và hợp nhánh.",
          focus: ["c1", "c2", "c3"],
          edges: ["parent1", "parent2"],
          metrics: { staged: "0 tệp", commits: "3", ref: "main", head: "C3" },
          changes: ["C3 → C2 → C1", "Không có commit nào bị sửa"],
          note: "Một commit có thể có nhiều cha. Đó chính là merge commit, sẽ gặp ở bài sau."
        },
        {
          short: "Nhãn & HEAD",
          type: "KỸ THUẬT",
          title: "Nhánh chỉ là nhãn",
          body: "Nhánh <code>main</code> là một nhãn trỏ tới commit. <code>HEAD</code> cho biết bạn đang đứng ở nhánh hoặc commit nào. Commit mới sẽ dời nhánh hiện tại; tạo nhánh mới chỉ là tạo thêm một nhãn, <strong>không chép thư mục</strong>.",
          focus: ["c3", "main", "head"],
          edges: ["label", "head-ref"],
          metrics: { staged: "0 tệp", commits: "3", ref: "main → C3", head: "C3" },
          changes: ["main trỏ C3", "HEAD trỏ main"],
          note: "Nếu HEAD trỏ thẳng vào commit thay vì nhánh, bạn ở detached HEAD. Commit lúc này không dời nhánh nào và dễ bị bỏ rơi."
        },
        {
          short: "Tóm tắt",
          type: "TÓM TẮT",
          tone: "final",
          title: "Bốn thứ cần nhớ",
          body: "Working tree để sửa, staging để chọn, commit là ảnh chụp bất biến, nhánh và HEAD là các nhãn. Khi lỡ tay dời nhãn, <code>git reflog</code> ghi lại đường đi gần đây để bạn quay lại.",
          focus: "all",
          edges: "all",
          metrics: { staged: "0 tệp", commits: "3", ref: "main", head: "C3" },
          changes: ["Commit là bất biến", "Nhãn là thứ di chuyển"],
          note: "Bài tiếp theo: tách nhánh, hợp nhánh và chọn giữa merge commit với fast-forward."
        }
      ]
    },

    "branch-merge": {
      id: "branch-merge",
      module: "delivery",
      title: "Tách nhánh và hợp lại",
      shortTitle: "Branch & merge",
      subtitle: "Hai người cùng sửa một dự án mà không giẫm lên nhau nhờ nhánh. Nhánh chỉ là nhãn; điều thật sự tạo nên lịch sử là các commit và quan hệ cha.",
      blurb: "Nhìn thấy một merge commit có hai cha thay vì học thuộc lệnh.",
      duration: "13 phút",
      level: "Cơ bản",
      tags: ["branch", "merge", "fast-forward", "merge commit", "HEAD"],
      metrics: [
        { key: "branches", label: "Nhánh", tone: "violet" },
        { key: "commits", label: "Commit", tone: "blue" },
        { key: "merge", label: "Kiểu hợp", tone: "yellow" },
        { key: "head", label: "HEAD", tone: "green" }
      ],
      nodes: [
        { id: "c1", type: "commit", x: 50, y: 80, w: 110, h: 58, label: "C1", sub: "nền chung" },
        { id: "c2", type: "commit", x: 200, y: 80, w: 110, h: 58, label: "C2", sub: "điểm tách" },
        { id: "c3", type: "commit", x: 350, y: 80, w: 110, h: 58, label: "C3", sub: "main đi tiếp" },
        { id: "f1", type: "commit", x: 200, y: 300, w: 110, h: 58, label: "F1", sub: "feature bắt đầu" },
        { id: "f2", type: "commit", x: 350, y: 300, w: 110, h: 58, label: "F2", sub: "feature xong" },
        { id: "m", type: "merge", x: 520, y: 195, w: 150, h: 64, label: "M · merge", sub: "hai cha" },
        { id: "main", type: "branch", x: 740, y: 80, w: 120, h: 58, label: "main", sub: "nhãn chính" },
        { id: "feature", type: "branch", x: 740, y: 300, w: 120, h: 58, label: "feature", sub: "nhãn phụ" }
      ],
      edges: [
        { id: "c2-c1", from: "c2", to: "c1", kind: "data", label: "cha" },
        { id: "c3-c2", from: "c3", to: "c2", kind: "data", label: "cha" },
        { id: "f1-c2", from: "f1", to: "c2", kind: "data", label: "tách" },
        { id: "f2-f1", from: "f2", to: "f1", kind: "data", label: "cha" },
        { id: "m-c3", from: "m", to: "c3", kind: "data", label: "cha 1" },
        { id: "m-f2", from: "m", to: "f2", kind: "data", label: "cha 2" },
        { id: "main-m", from: "main", to: "m", kind: "data", label: "trỏ" },
        { id: "feature-m", from: "feature", to: "m", kind: "data", label: "trỏ" }
      ],
      learn: [
        "Tạo nhánh bằng cách thêm một nhãn tại commit hiện tại.",
        "Đọc được lịch sử phân nhánh và điểm tách.",
        "Phân biệt fast-forward với merge commit.",
        "Biết vì sao xóa nhánh không xóa commit."
      ],
      steps: [
        {
          short: "Nền chung",
          type: "TỔNG QUAN",
          title: "Xuất phát từ một đường",
          body: "Trước khi tách nhánh, <code>main</code> chỉ là một chuỗi commit C1 → C2. Mọi người dùng chung lịch sử này. Tách nhánh là tạo thêm một nhãn tại C2, không sao chép tệp.",
          focus: ["c1", "c2"],
          edges: ["c2-c1"],
          metrics: { branches: "1", commits: "2", merge: "—", head: "main · C2" },
          changes: ["Một nhánh duy nhất", "C2 là điểm mới nhất"],
          note: "Nhánh trong Git rất nhẹ. Tạo hàng chục nhánh không làm kho mã phình to như sao chép thư mục."
        },
        {
          short: "Tách nhánh",
          type: "KỸ THUẬT",
          title: "Thêm một chiếc nhãn",
          body: "<code>git switch -c feature</code> tạo nhãn <code>feature</code> tại C2 và chuyển HEAD sang đó. Từ giờ, commit mới trên nhánh này sẽ dời <code>feature</code>, còn <code>main</code> đứng yên cho tới khi được cập nhật.",
          focus: ["c2", "f1", "feature"],
          edges: ["f1-c2"],
          metrics: { branches: "2", commits: "2", merge: "—", head: "feature · C2" },
          changes: ["+ Nhãn feature tại C2", "HEAD chuyển sang feature"],
          note: "Tên nhánh chỉ là quy ước. Điều quan trọng là commit nào đang được nhãn trỏ tới."
        },
        {
          short: "Hai đường",
          type: "KỸ THUẬT",
          title: "Mỗi nhánh đi một hướng",
          body: "Feature thêm F1 rồi F2. Trong lúc đó main nhận C3 từ một thay đổi khác. Hai nhánh cùng có tổ tiên C2 nhưng <strong>không còn là một đường thẳng</strong>.",
          focus: ["c3", "f1", "f2", "main", "feature"],
          edges: ["c3-c2", "f1-c2", "f2-f1"],
          metrics: { branches: "2", commits: "5", merge: "—", head: "feature · F2" },
          changes: ["main có C3", "feature có F1, F2"],
          note: "Đây là lúc cần hợp nhánh. Khoảng cách càng lớn, xung đột càng khó xử lý; nhánh ngắn và merge thường xuyên giúp giảm đau."
        },
        {
          short: "Hợp nhánh",
          type: "KỸ THUẬT",
          title: "Merge commit có hai cha",
          body: "Chạy <code>git merge feature</code> khi đang ở main. Git tạo M với <strong>cha thứ nhất là C3, cha thứ hai là F2</strong>. Cả hai lịch sử được giữ lại, không commit nào bị chép lại.",
          focus: ["c3", "f2", "m"],
          edges: ["m-c3", "m-f2"],
          metrics: { branches: "2", commits: "6", merge: "merge commit", head: "main · M" },
          changes: ["+ Merge commit M", "Hai cha được ghi lại"],
          note: "Nếu hai nhánh sửa cùng một vùng tệp, Git dừng lại để bạn chọn. Bài sau đi vào đúng tình huống đó."
        },
        {
          short: "Dời nhãn",
          type: "KỸ THUẬT",
          title: "Cả hai nhãn về M",
          body: "Sau merge, <code>main</code> trỏ M. <code>feature</code> vẫn trỏ M nếu chưa xóa. Xóa nhãn feature chỉ bỏ tên gọi; các commit F1, F2 vẫn nằm trong lịch sử vì M trỏ tới chúng.",
          focus: ["m", "main", "feature"],
          edges: ["main-m", "feature-m"],
          metrics: { branches: "2", commits: "6", merge: "xong", head: "main · M" },
          changes: ["main trỏ M", "Xóa feature không mất commit"],
          note: "Chỉ commit không còn đường nào trỏ tới mới thành rác và bị dọn. Đó là lý do nhánh đã merge có thể xóa an toàn."
        },
        {
          short: "Chọn kiểu",
          type: "TÓM TẮT",
          tone: "final",
          title: "Fast-forward hay merge commit?",
          body: "Nếu main chưa đi tiếp kể từ điểm tách, Git có thể chỉ dời nhãn main lên F2: đó là <strong>fast-forward</strong>, lịch sử thẳng. Nếu main đã có commit riêng, cần merge commit để giữ cả hai. Rebase thì viết lại commit sang nền mới, đẹp hơn nhưng đổi mã băm.",
          focus: "all",
          edges: "all",
          metrics: { branches: "2", commits: "6", merge: "merge commit", head: "main · M" },
          changes: ["Fast-forward khi main chưa rẽ", "Merge commit khi hai bên cùng tiến"],
          note: "Đừng rebase nhánh đã chia sẻ cho người khác. Viết lại lịch sử công khai sẽ khiến đồng đội phải xử lý lại."
        }
      ]
    },

    "merge-conflict": {
      id: "merge-conflict",
      module: "delivery",
      title: "Xung đột hợp nhánh",
      shortTitle: "Merge conflict",
      subtitle: "Git rất giỏi tự hợp các thay đổi không chồng lấn. Khi hai bên sửa cùng một vùng theo hai ý định khác nhau, nó dừng lại và nhờ con người quyết định.",
      blurb: "Đọc dấu xung đột, hiểu ý định hai bên rồi kiểm tra lại.",
      duration: "12 phút",
      level: "Cơ bản",
      tags: ["merge conflict", "three-way merge", "base", "ours", "theirs"],
      metrics: [
        { key: "conflicts", label: "Xung đột", tone: "coral" },
        { key: "markers", label: "Dấu", tone: "yellow" },
        { key: "tests", label: "Kiểm thử", tone: "green" },
        { key: "merge", label: "Merge", tone: "violet" }
      ],
      nodes: [
        { id: "base", type: "commit", x: 90, y: 210, w: 140, h: 64, label: "Base", sub: "tổ tiên chung" },
        { id: "ours", type: "commit", x: 300, y: 90, w: 150, h: 64, label: "Ours", sub: "main · đổi giá" },
        { id: "theirs", type: "commit", x: 300, y: 320, w: 150, h: 64, label: "Theirs", sub: "feature · đổi nhãn" },
        { id: "merge", type: "merge", x: 520, y: 210, w: 150, h: 64, label: "Merge", sub: "đang dở" },
        { id: "file", type: "file", x: 710, y: 90, w: 150, h: 64, label: "Tệp xung đột", sub: "dấu <<<<<<<" },
        { id: "test", type: "check", x: 710, y: 320, w: 150, h: 64, label: "Test", sub: "chạy lại" }
      ],
      edges: [
        { id: "ours-base", from: "ours", to: "base", kind: "data", label: "cha", bow: 12 },
        { id: "theirs-base", from: "theirs", to: "base", kind: "data", label: "cha", bow: -12 },
        { id: "merge-ours", from: "merge", to: "ours", kind: "data", label: "cha 1" },
        { id: "merge-theirs", from: "merge", to: "theirs", kind: "data", label: "cha 2" },
        { id: "merge-file", from: "merge", to: "file", kind: "request", label: "mở" },
        { id: "file-test", from: "file", to: "test", kind: "request", label: "chạy" }
      ],
      learn: [
        "Giải thích vì sao Git không tự chọn khi hai bên sửa cùng vùng.",
        "Đọc được ba phần base, ours, theirs trong dấu xung đột.",
        "Biết quy trình sửa: hiểu ý định, chọn nội dung, bỏ dấu, chạy test.",
        "Hiểu vì sao không nên chọn ours hoặc theirs cho toàn bộ tệp."
      ],
      steps: [
        {
          short: "Gốc chung",
          type: "TỔNG QUAN",
          title: "Ba phiên bản, không phải hai",
          body: "Khi hợp nhánh, Git so sánh ba phiên bản: <strong>base</strong> là tổ tiên chung, <strong>ours</strong> là nhánh đang đứng, <strong>theirs</strong> là nhánh được merge vào. Có base mới biết mỗi bên đã thay đổi gì.",
          focus: ["base", "ours", "theirs"],
          edges: ["ours-base", "theirs-base"],
          metrics: { conflicts: "0", markers: "0", tests: "—", merge: "chuẩn bị" },
          changes: ["Xác định tổ tiên chung", "So sánh hai tập thay đổi"],
          note: "Đây gọi là three-way merge. Nếu không có base, Git không thể biết bên nào thêm hay bên nào xóa."
        },
        {
          short: "Hai ý định",
          type: "KỸ THUẬT",
          title: "Cùng dòng, khác mục đích",
          body: "Main sửa giá trong bảng sản phẩm. Feature sửa nhãn ngay cạnh đó. Hai thay đổi chạm cùng vùng nhưng phục vụ hai mục đích khác nhau. Git không đủ ngữ cảnh để chọn thay bạn.",
          focus: ["ours", "theirs"],
          edges: ["ours-base", "theirs-base"],
          metrics: { conflicts: "1", markers: "3", tests: "chưa chạy", merge: "đang dở" },
          changes: ["Ours đổi giá", "Theirs đổi nhãn"],
          note: "Xung đột không phải lỗi. Nó là tín hiệu rằng có quyết định nghiệp vụ cần con người xác nhận."
        },
        {
          short: "Git dừng",
          type: "CẢNH BÁO",
          tone: "warn",
          title: "Trạng thái đang merge",
          body: "Git ghi trạng thái merge và đánh dấu tệp xung đột. Bạn có thể mở từng tệp, sửa, rồi <code>git add</code> để đánh dấu đã giải quyết. Chỉ khi mọi xung đột được xử lý, <code>git commit</code> mới hoàn tất merge.",
          focus: ["merge", "file"],
          edges: ["merge-file"],
          warn: ["merge"],
          metrics: { conflicts: "1", markers: "3", tests: "chưa chạy", merge: "đang dở" },
          changes: ["Tệp được đánh dấu xung đột", "Merge chưa hoàn tất"],
          note: "Đừng xóa cả khối đánh dấu rồi commit ngay. Hãy đọc cả hai phía trước khi chọn nội dung cuối."
        },
        {
          short: "Đọc dấu",
          type: "KỸ THUẬT",
          title: "Ba khối trong một tệp",
          body: "Dấu <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt; ours</code> mở phần của nhánh hiện tại, <code>=======</code> ngăn cách, <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt; theirs</code> đóng phần bên kia. Base có thể xuất hiện trong cấu hình diff3. Mỗi khối là một câu hỏi, không phải một dòng để xóa.",
          focus: ["file", "merge"],
          edges: ["merge-file"],
          metrics: { conflicts: "1", markers: "3", tests: "chưa chạy", merge: "đang dở" },
          changes: ["Đọc được phần ours và theirs", "Xác định ý định từng bên"],
          note: "Nếu không chắc, mở lịch sử của cả hai commit để xem thay đổi đó phục vụ việc gì."
        },
        {
          short: "Chọn & kiểm",
          type: "KỸ THUẬT",
          title: "Viết phiên bản cuối",
          body: "Sửa tệp thành nội dung đúng về nghiệp vụ, thường là <strong>kết hợp cả hai ý định</strong> chứ không chọn phe. Xóa toàn bộ dấu, chạy test và kiểm tra thủ công vùng vừa sửa. Sau đó <code>git add</code> tệp đã giải quyết.",
          focus: ["file", "test"],
          edges: ["file-test"],
          metrics: { conflicts: "0", markers: "0", tests: "đạt", merge: "chờ commit" },
          changes: ["Dấu xung đột đã xóa", "Test chạy lại và đạt"],
          note: "Chọn ours hoặc theirs cho cả tệp là cách nhanh nhất để làm mất thay đổi của đồng đội. Chỉ dùng khi thật sự muốn bỏ một phía."
        },
        {
          short: "Chốt merge",
          type: "TÓM TẮT",
          tone: "final",
          title: "Commit merge và ghi lại lý do",
          body: "Khi mọi xung đột đã xử lý, <code>git commit</code> tạo merge commit. Thông điệp nên ghi rõ đã chọn gì và vì sao. Nhánh nhỏ, merge sớm và bật <code>rerere</code> giúp lần sau đỡ lặp lại việc giải quyết.",
          focus: "all",
          edges: "all",
          metrics: { conflicts: "0", markers: "0", tests: "đạt", merge: "xong" },
          changes: ["Merge commit hoàn tất", "Lịch sử giữ cả hai nhánh"],
          note: "Bài tiếp theo: tự động hóa build và test để những lỗi như trên bị chặn trước khi tới production."
        }
      ]
    },

    "ci-pipeline": {
      id: "ci-pipeline",
      module: "delivery",
      title: "Pipeline CI từ đầu đến cuối",
      shortTitle: "CI pipeline",
      subtitle: "Mỗi lần push nên tạo ra một bản build lặp lại được, chạy test và sinh artifact bất biến. Pipeline tốt giống một dây chuyền: cùng đầu vào, cùng đầu ra, không phụ thuộc máy ai.",
      blurb: "Push một lần, chạy build và test trên máy sạch.",
      duration: "14 phút",
      level: "Cơ bản",
      tags: ["CI", "build", "test", "artifact", "webhook"],
      metrics: [
        { key: "commit", label: "Commit", tone: "violet" },
        { key: "build", label: "Build", tone: "coral" },
        { key: "test", label: "Test", tone: "green" },
        { key: "artifact", label: "Artifact", tone: "yellow" }
      ],
      nodes: [
        { id: "repo", type: "store", x: 40, y: 210, w: 140, h: 64, label: "Repo", sub: "push / pull request" },
        { id: "runner", type: "worker", x: 220, y: 210, w: 150, h: 64, label: "CI runner", sub: "máy sạch" },
        { id: "build", type: "build", x: 410, y: 80, w: 140, h: 64, label: "Build", sub: "biên dịch / đóng gói" },
        { id: "test", type: "check", x: 410, y: 330, w: 140, h: 64, label: "Test", sub: "unit + tích hợp" },
        { id: "artifact", type: "artifact", x: 600, y: 205, w: 150, h: 64, label: "Artifact", sub: "bản bất biến" },
        { id: "deploy", type: "deploy", x: 800, y: 205, w: 100, h: 64, label: "Deploy", sub: "môi trường" }
      ],
      edges: [
        { id: "trigger", from: "repo", to: "runner", kind: "request", label: "webhook" },
        { id: "run-build", from: "runner", to: "build", kind: "request", label: "chạy" },
        { id: "run-test", from: "runner", to: "test", kind: "request", label: "chạy" },
        { id: "build-art", from: "build", to: "artifact", kind: "data", label: "binary" },
        { id: "test-art", from: "test", to: "artifact", kind: "data", label: "kết quả" },
        { id: "ship", from: "artifact", to: "deploy", kind: "request", label: "phát hành" }
      ],
      learn: [
        "Mô tả chuỗi sự kiện từ push tới artifact.",
        "Biết vì sao pipeline phải chạy trên commit cố định và máy sạch.",
        "Phân biệt build một lần với build lại ở từng môi trường.",
        "Hiểu artifact bất biến giúp truy vết và rollback."
      ],
      steps: [
        {
          short: "Kích hoạt",
          type: "TỔNG QUAN",
          title: "Push tạo ra một sự kiện",
          body: "Khi push hoặc mở pull request, kho mã gửi webhook tới hệ thống CI. Runner nhận đúng mã commit, không phải nhánh đang trôi. Từ đây mọi bước đều gắn với một <strong>commit cụ thể</strong>.",
          focus: ["repo", "runner"],
          edges: ["trigger"],
          metrics: { commit: "a1b2c3d", build: "chờ", test: "chờ", artifact: "—" },
          changes: ["+ Sự kiện push", "Runner nhận commit a1b2c3d"],
          note: "Đừng để pipeline tự checkout nhánh mới nhất. Hãy ghim đúng mã commit để kết quả có thể tái lập."
        },
        {
          short: "Máy sạch",
          type: "KỸ THUẬT",
          title: "Checkout và cache đúng thứ",
          body: "Runner bắt đầu từ máy sạch, cài dependency theo lockfile rồi cache thư mục dependency. Cache giúp nhanh nhưng <strong>không được che giấu thay đổi</strong>: khóa cache phải gắn với lockfile và phiên bản công cụ.",
          focus: ["runner"],
          edges: ["trigger", "run-build", "run-test"],
          metrics: { commit: "a1b2c3d", build: "chờ", test: "chờ", artifact: "—" },
          changes: ["Môi trường sạch", "Dependency lấy từ lockfile"],
          note: "Cache sai khóa là nguồn gốc của những lần pipeline xanh trên máy CI nhưng đỏ trên máy khác."
        },
        {
          short: "Build",
          type: "KỸ THUẬT",
          title: "Tạo artifact từ một lần build",
          body: "Build biên dịch, kiểm tra kiểu và đóng gói. Kết quả được đặt tên theo commit hoặc số phiên bản, ví dụ <code>v42-a1b2c3d</code>. Artifact này là thứ duy nhất được phát hành; <strong>không build lại ở production</strong>.",
          focus: ["build", "artifact"],
          edges: ["run-build", "build-art"],
          metrics: { commit: "a1b2c3d", build: "42 giây", test: "chờ", artifact: "v42" },
          changes: ["+ Build thành công", "+ Artifact v42"],
          note: "Build một lần, deploy nhiều nơi. Nếu mỗi môi trường build lại, bạn không còn chắc chúng giống nhau."
        },
        {
          short: "Test",
          type: "KỸ THUẬT",
          title: "Kiểm thử trên chính artifact",
          body: "Unit test chạy nhanh, test tích hợp kiểm tra với database hoặc queue thật. Quan trọng là test chạy trên cùng mã nguồn và dependency đã ghim. Kết quả test được ghi vào artifact hoặc báo cáo đi kèm.",
          focus: ["test", "artifact"],
          edges: ["run-test", "test-art"],
          metrics: { commit: "a1b2c3d", build: "42 giây", test: "128 đạt", artifact: "v42" },
          changes: ["128 test đạt", "Báo cáo gắn với artifact"],
          note: "Test chỉ đáng tin khi môi trường đủ giống thật. Mock quá nhiều sẽ tạo cảm giác an toàn giả."
        },
        {
          short: "Phát hành",
          type: "KỸ THUẬT",
          title: "Cùng một artifact đi qua các môi trường",
          body: "Artifact v42 được đẩy qua staging rồi production. Mỗi lần triển khai ghi lại mã commit, phiên bản và người kích hoạt. Vì artifact bất biến, rollback chỉ là chọn lại phiên bản cũ.",
          focus: ["artifact", "deploy"],
          edges: ["ship"],
          metrics: { commit: "a1b2c3d", build: "42 giây", test: "128 đạt", artifact: "v42 → prod" },
          changes: ["v42 lên môi trường", "Có bản ghi truy vết"],
          note: "Không đưa bí mật vào artifact. Bí mật nên được inject lúc chạy, theo môi trường."
        },
        {
          short: "Tóm tắt",
          type: "TÓM TẮT",
          tone: "final",
          title: "Đường đi lặp lại được",
          body: "Push → checkout đúng commit → build một lần → test → artifact bất biến → deploy. Mọi bước đều có log, thời gian và đầu ra. Khi có sự cố, bạn trả lời được: bản nào đang chạy, sinh ra từ commit nào, qua những cổng nào.",
          focus: "all",
          edges: "all",
          metrics: { commit: "a1b2c3d", build: "42 giây", test: "128 đạt", artifact: "v42" },
          changes: ["Pipeline tái lập được", "Truy vết từ production về commit"],
          note: "Bài tiếp theo: đặt cổng chất lượng để pipeline không chỉ nhanh mà còn đáng tin."
        }
      ]
    },

    "quality-gates": {
      id: "quality-gates",
      module: "delivery",
      title: "Cổng chất lượng",
      shortTitle: "Quality gates",
      subtitle: "Pipeline không chỉ để chạy test. Nó là nơi đặt những cổng mà thay đổi phải vượt qua trước khi được phép đi tiếp. Cổng tốt chặn sớm, nhanh và có lý do rõ ràng.",
      blurb: "Lint, test, quét bảo mật và một cổng quyết định duy nhất.",
      duration: "13 phút",
      level: "Cơ bản",
      tags: ["CI", "lint", "test", "security", "quality gate"],
      metrics: [
        { key: "checks", label: "Cổng đã chạy", tone: "blue" },
        { key: "failed", label: "Thất bại", tone: "coral" },
        { key: "time", label: "Thời gian", tone: "yellow" },
        { key: "gate", label: "Kết luận", tone: "green" }
      ],
      nodes: [
        { id: "pr", type: "code", x: 40, y: 210, w: 150, h: 64, label: "Pull request", sub: "thay đổi" },
        { id: "lint", type: "check", x: 230, y: 80, w: 140, h: 64, label: "Lint", sub: "định dạng, kiểu" },
        { id: "unit", type: "check", x: 230, y: 330, w: 140, h: 64, label: "Unit test", sub: "nhanh, cô lập" },
        { id: "security", type: "shield", x: 410, y: 80, w: 140, h: 64, label: "Bảo mật", sub: "dependency, secret" },
        { id: "integration", type: "test", x: 410, y: 330, w: 140, h: 64, label: "Tích hợp", sub: "DB, queue thật" },
        { id: "gate", type: "gate", x: 600, y: 210, w: 150, h: 64, label: "Quality gate", sub: "đủ điều kiện?" },
        { id: "artifact", type: "artifact", x: 800, y: 210, w: 100, h: 64, label: "Gói", sub: "artifact" }
      ],
      edges: [
        { id: "pr-lint", from: "pr", to: "lint", kind: "request", label: "chạy" },
        { id: "pr-unit", from: "pr", to: "unit", kind: "request", label: "chạy" },
        { id: "lint-sec", from: "lint", to: "security", kind: "data", label: "sạch" },
        { id: "unit-int", from: "unit", to: "integration", kind: "data", label: "đạt" },
        { id: "sec-gate", from: "security", to: "gate", kind: "data", label: "báo cáo" },
        { id: "int-gate", from: "integration", to: "gate", kind: "data", label: "báo cáo" },
        { id: "gate-art", from: "gate", to: "artifact", kind: "request", label: "cho qua" }
      ],
      learn: [
        "Sắp xếp cổng theo thứ tự nhanh trước, chậm sau.",
        "Biết mỗi cổng bắt loại lỗi nào.",
        "Hiểu required check và vì sao không nên bỏ qua.",
        "Giữ pipeline dưới ngưỡng thời gian để người dùng không tìm cách lách."
      ],
      steps: [
        {
          short: "Mọi thay đổi",
          type: "TỔNG QUAN",
          title: "Một cửa vào duy nhất",
          body: "Mọi thay đổi vào nhánh chính đều đi qua pull request và bộ kiểm tra tự động. Nhánh chính được bảo vệ: không push trực tiếp, không merge khi cổng đỏ. Đây là <strong>hàng rào đầu tiên</strong>.",
          focus: ["pr"],
          edges: ["pr-lint", "pr-unit"],
          metrics: { checks: "0", failed: "0", time: "0 giây", gate: "chờ" },
          changes: ["Thay đổi vào qua pull request", "Nhánh chính được bảo vệ"],
          note: "Cổng chỉ có giá trị khi không ai có quyền bỏ qua. Nếu admin có thể merge đỏ, cổng chỉ là trang trí."
        },
        {
          short: "Kiểm nhanh",
          type: "KỸ THUẬT",
          title: "Lint và unit test chạy trước",
          body: "Lint bắt lỗi định dạng, kiểu và quy ước trong vài giây. Unit test kiểm tra logic cô lập. Chạy hai cổng này trước giúp <strong>thất bại sớm</strong> và tiết kiệm thời gian runner.",
          focus: ["pr", "lint", "unit"],
          edges: ["pr-lint", "pr-unit"],
          metrics: { checks: "2", failed: "0", time: "12 giây", gate: "chờ" },
          changes: ["+ Lint đạt", "+ 120 unit test đạt"],
          note: "Một lỗi chính tả trong tên biến nên bị chặn sau 10 giây, không phải sau 40 phút."
        },
        {
          short: "Tích hợp",
          type: "KỸ THUẬT",
          title: "Kiểm tra với hệ thống thật",
          body: "Test tích hợp dựng database, queue hoặc service giả lập sát thật để kiểm tra ranh giới. Chúng chậm hơn nhưng bắt được lỗi mà unit test bỏ qua: migration, transaction, serialization, timeout.",
          focus: ["integration", "unit"],
          edges: ["unit-int"],
          metrics: { checks: "4", failed: "0", time: "38 giây", gate: "chờ" },
          changes: ["+ Test tích hợp", "Database và queue được dựng thật"],
          note: "Đừng mock mọi thứ. Một test tích hợp tốt đáng giá hơn mười test unit chỉ kiểm tra mock."
        },
        {
          short: "Bảo mật",
          type: "KỸ THUẬT",
          title: "Quét dependency và bí mật",
          body: "Cổng bảo mật quét thư viện có lỗ hổng đã biết, mẫu bí mật bị commit nhầm và một số lỗi tĩnh. Kết quả cần phân loại: chặn lỗi nghiêm trọng, cảnh báo phần còn lại để tránh <strong>mệt mỏi vì cảnh báo</strong>.",
          focus: ["security", "lint"],
          edges: ["lint-sec"],
          metrics: { checks: "5", failed: "0", time: "52 giây", gate: "chờ" },
          changes: ["+ Quét dependency", "+ Quét bí mật trong diff"],
          note: "Một bí mật đã lộ phải được thu hồi và đổi mới, không chỉ xóa khỏi commit. Lịch sử vẫn còn bản sao."
        },
        {
          short: "Cổng quyết định",
          type: "KỸ THUẬT",
          title: "Tất cả cùng đạt mới qua",
          body: "Quality gate gom kết quả các cổng. Chỉ khi mọi required check đạt, nút merge mới sáng và artifact mới được tạo. Một cổng đỏ là đủ để dừng. Cổng phải <strong>nhất quán và quan sát được</strong>, không phụ thuộc người review nhớ hay quên.",
          focus: ["gate"],
          edges: ["sec-gate", "int-gate", "gate-art"],
          metrics: { checks: "5", failed: "0", time: "52 giây", gate: "cho qua" },
          changes: ["Mọi cổng đạt", "Artifact được tạo"],
          note: "Nếu cổng hay báo sai, hãy sửa cổng thay vì thêm nút bỏ qua. Niềm tin vào cổng là tài sản."
        },
        {
          short: "Giữ tốc độ",
          type: "TÓM TẮT",
          tone: "final",
          title: "Nhanh, ổn định, không thương lượng",
          body: "Chạy song song các nhánh độc lập, cache dependency, tách bộ test chậm và xử lý test chập chờn. Mục tiêu thực tế là phản hồi trong vài phút. Pipeline quá chậm sẽ bị lách; pipeline chập chờn sẽ bị bỏ qua.",
          focus: "all",
          edges: "all",
          metrics: { checks: "5", failed: "0", time: "52 giây", gate: "cho qua" },
          changes: ["Cổng nhanh và ổn định", "Không có đường tắt qua kiểm tra"],
          note: "Bài tiếp theo: đưa artifact đã qua cổng ra production và luôn chuẩn bị đường lùi."
        }
      ]
    },

    "deploy-rollback": {
      id: "deploy-rollback",
      module: "delivery",
      title: "Phát hành và đường lùi",
      shortTitle: "Deploy & rollback",
      subtitle: "Deploy là đưa artifact tới môi trường chạy. Phát hành tốt không phải lần đầu không lỗi, mà là lỗi được phát hiện sớm, ảnh hưởng ít người và có đường quay lại nhanh.",
      blurb: "Canary, giám sát và rollback có kiểm soát.",
      duration: "14 phút",
      level: "Trung cấp",
      tags: ["deploy", "canary", "rollback", "migration", "observability"],
      metrics: [
        { key: "traffic", label: "Lưu lượng", tone: "blue" },
        { key: "version", label: "Phiên bản", tone: "violet" },
        { key: "error", label: "Tỉ lệ lỗi", tone: "coral" },
        { key: "p95", label: "p95", tone: "green" }
      ],
      nodes: [
        { id: "artifact", type: "artifact", x: 40, y: 210, w: 150, h: 64, label: "Artifact v42", sub: "đã qua cổng" },
        { id: "staging", type: "server", x: 220, y: 80, w: 150, h: 64, label: "Staging", sub: "giống production" },
        { id: "canary", type: "deploy", x: 380, y: 210, w: 150, h: 64, label: "Canary", sub: "5% lưu lượng" },
        { id: "prod", type: "server", x: 600, y: 210, w: 150, h: 64, label: "Production", sub: "100% lưu lượng" },
        { id: "monitor", type: "monitor", x: 770, y: 80, w: 130, h: 64, label: "Giám sát", sub: "lỗi, p95" },
        { id: "old", type: "rollback", x: 770, y: 330, w: 130, h: 64, label: "v41", sub: "đường lùi" }
      ],
      edges: [
        { id: "to-staging", from: "artifact", to: "staging", kind: "request", label: "thử" },
        { id: "to-canary", from: "staging", to: "canary", kind: "request", label: "đạt" },
        { id: "to-prod", from: "canary", to: "prod", kind: "request", label: "tăng dần" },
        { id: "prod-monitor", from: "prod", to: "monitor", kind: "data", label: "số liệu" },
        { id: "canary-monitor", from: "canary", to: "monitor", kind: "data", label: "so sánh" },
        { id: "rollback", from: "prod", to: "old", kind: "response", label: "rollback" }
      ],
      learn: [
        "Phân biệt deploy với release và vì sao nên tách hai việc.",
        "Triển khai canary và so sánh chỉ số với baseline.",
        "Biết rollback binary khác rollback dữ liệu.",
        "Hiểu migration tương thích ngược và feature flag giúp đường lùi an toàn."
      ],
      steps: [
        {
          short: "Một artifact",
          type: "TỔNG QUAN",
          title: "Build một lần, deploy nhiều nơi",
          body: "Artifact v42 đã qua cổng chất lượng. Nó được đưa nguyên bản qua staging rồi production, không build lại. Cùng một gói, cùng một mã băm, nên mọi kết quả kiểm thử đều có ý nghĩa cho bản chạy thật.",
          focus: ["artifact", "staging"],
          edges: ["to-staging"],
          metrics: { traffic: "0%", version: "v42", error: "—", p95: "—" },
          changes: ["v42 lên staging", "Không build lại"],
          note: "Deploy và release là hai việc. Deploy đưa mã ra môi trường; release mở tính năng cho người dùng."
        },
        {
          short: "Staging",
          type: "KỸ THUẬT",
          title: "Smoke test trên môi trường giống thật",
          body: "Staging có cấu hình, dependency và dữ liệu mẫu gần production. Chạy smoke test cho các luồng chính: đăng nhập, thanh toán, đọc dữ liệu. Mục tiêu là bắt lỗi cấu hình và migration trước khi có người dùng thật.",
          focus: ["staging"],
          edges: ["to-staging", "to-canary"],
          metrics: { traffic: "0%", version: "v42", error: "0%", p95: "170 ms" },
          changes: ["Smoke test đạt", "Migration chạy trên dữ liệu mẫu"],
          note: "Staging không bao giờ giống production hoàn toàn. Đừng coi việc qua staging là bảo đảm an toàn tuyệt đối."
        },
        {
          short: "Canary",
          type: "KỸ THUẬT",
          title: "Cho 5% người dùng thử trước",
          body: "Canary nhận một phần nhỏ lưu lượng, thường theo tỉ lệ hoặc theo nhóm người dùng. So sánh tỉ lệ lỗi, độ trễ và chỉ số nghiệp vụ với phiên bản cũ. Nếu mọi thứ ổn, tăng dần; nếu không, dừng và quay lại.",
          focus: ["canary", "monitor"],
          edges: ["to-canary", "canary-monitor", "prod-monitor"],
          metrics: { traffic: "5%", version: "v41 + v42", error: "0,2%", p95: "180 ms" },
          changes: ["+ 5% lưu lượng vào v42", "So sánh với baseline v41"],
          note: "Canary cần đủ lưu lượng để phát hiện lỗi. 5% của 100 request mỗi ngày không đủ kết luận."
        },
        {
          short: "Tăng dần",
          type: "KỸ THUẬT",
          title: "25% → 50% → 100%",
          body: "Mỗi bước tăng lưu lượng đều có cửa sổ quan sát và điều kiện dừng. Tự động hóa giúp giảm thời gian phơi nhiễm: nếu tỉ lệ lỗi hoặc p95 vượt ngưỡng, hệ thống tự quay lại phiên bản trước thay vì chờ người trực.",
          focus: ["prod", "monitor"],
          edges: ["to-prod", "prod-monitor"],
          metrics: { traffic: "100%", version: "v42", error: "0,2%", p95: "185 ms" },
          changes: ["v42 nhận toàn bộ lưu lượng", "Chỉ số nằm trong ngưỡng"],
          note: "Ngưỡng rollback phải được định nghĩa trước khi deploy. Đặt ngưỡng sau khi thấy lỗi là tự lừa mình."
        },
        {
          short: "Đường lùi",
          type: "CẢNH BÁO",
          tone: "warn",
          title: "Rollback không chỉ là đổi phiên bản",
          body: "Giả sử mười phút sau, tỉ lệ lỗi của v42 tăng vọt. Cách nhanh nhất là chuyển lưu lượng về v41. Nhưng nếu migration đã xóa hoặc đổi cột, mã cũ có thể không đọc được dữ liệu mới. <strong>Rollback binary phải đi kèm rollback dữ liệu tương thích.</strong>",
          focus: ["prod", "old", "monitor"],
          edges: ["rollback", "prod-monitor"],
          warn: ["old"],
          metrics: { traffic: "0%", version: "v41", error: "0,3%", p95: "185 ms" },
          changes: ["Lưu lượng quay về v41", "Sự cố được khoanh vùng"],
          note: "Dùng expand-contract: thêm cột mới, ghi cả hai, chuyển đọc, rồi mới xóa cột cũ ở lần deploy sau. Feature flag giúp tắt tính năng mà không cần deploy."
        },
        {
          short: "Tóm tắt",
          type: "TÓM TẮT",
          tone: "final",
          title: "Phát hành là một quy trình, không phải cú bấm",
          body: "Artifact bất biến → staging → canary → tăng dần → giám sát → rollback khi cần. Mỗi bước có tiêu chí vào, tiêu chí dừng và người chịu trách nhiệm. Deploy nhỏ, thường xuyên và quan sát được thường an toàn hơn một lần deploy lớn.",
          focus: "all",
          edges: "all",
          metrics: { traffic: "0%", version: "v41", error: "0,3%", p95: "185 ms" },
          changes: ["Có đường lùi đã kiểm tra", "Sự cố được ghi nhận để học"],
          note: "Sau sự cố, viết lại điều đã xảy ra và điều sẽ đổi. Đừng tìm người để đổ lỗi; hãy tìm bước nào trong quy trình còn thiếu."
        }
      ]
    }
  });

  SL.practice.push(
    {
      id: "p7",
      tag: "Git",
      title: "Mất commit sau khi reset",
      scenario: "Một lập trình viên chạy nhầm git reset --hard trên nhánh cục bộ và mất hai commit chưa push. Máy chưa tắt, chưa chạy dọn dẹp. Nhóm cần lấy lại công việc mà không làm ảnh hưởng người khác.",
      metrics: [
        { label: "Nhánh", value: "cục bộ" },
        { label: "Commit mất", value: "2", danger: true },
        { label: "Đã push", value: "không" },
        { label: "Thời gian", value: "vừa xảy ra" }
      ],
      options: [
        "Clone lại kho mã vì commit đã biến mất",
        "Dùng git reflog tìm mã commit cũ rồi tạo lại nhánh tại đó",
        "Force push nhánh hiện tại để đồng bộ",
        "Chạy git gc --prune=now để dọn rồi thử lại"
      ],
      correct: 1,
      explain: "Reflog ghi lại các vị trí HEAD và nhánh đã đi qua, kể cả commit không còn được nhãn nào trỏ tới. Tìm mã commit trong reflog rồi tạo nhánh mới tại đó là cách cứu chuẩn. Clone lại chỉ lấy trạng thái trên remote, còn force push và gc có thể làm mất dấu vết."
    },
    {
      id: "p8",
      tag: "Git",
      title: "Merge xong mất thay đổi của feature",
      scenario: "Sau khi merge, một đoạn mã của feature biến mất dù pull request được đánh dấu đã hợp nhất. Trong lúc giải quyết xung đột, lập trình viên chọn toàn bộ phiên bản ours cho tệp bị tranh chấp.",
      metrics: [
        { label: "Xung đột", value: "đã xử lý" },
        { label: "Chọn", value: "ours toàn tệp", danger: true },
        { label: "Test", value: "đạt" },
        { label: "Phát hiện", value: "sau merge" }
      ],
      options: [
        "Revert merge commit và bỏ luôn feature",
        "Mở diff của merge commit, xác định hunk bị chọn sai rồi sửa bằng commit mới",
        "Force push main để viết lại lịch sử",
        "Chạy lại merge mà không thay đổi gì"
      ],
      correct: 1,
      explain: "Chọn ours cho cả tệp là bỏ toàn bộ thay đổi của nhánh kia. Cần xem diff giữa merge commit và từng cha để tìm phần bị mất, khôi phục đúng hunk rồi thêm test hồi quy. Revert cả merge sẽ bỏ luôn phần đúng; force push không sửa được nội dung."
    },
    {
      id: "p9",
      tag: "CI",
      title: "Pipeline xanh nhưng production lỗi",
      scenario: "Pipeline báo xanh, artifact lên production thì lỗi cấu hình. Bộ test chạy với biến môi trường giả lập và cache dependency từ lần build trước; không có bước kiểm tra sau deploy.",
      metrics: [
        { label: "Pipeline", value: "xanh" },
        { label: "Production", value: "lỗi", danger: true },
        { label: "Môi trường test", value: "giả lập" },
        { label: "Smoke test", value: "không có" }
      ],
      options: [
        "Tắt cache để pipeline luôn sạch",
        "Thêm smoke test sau deploy và kiểm tra cấu hình trên môi trường thật",
        "Viết thêm thật nhiều unit test cho phần cấu hình",
        "Chuyển sang deploy thủ công để kiểm tra bằng mắt"
      ],
      correct: 1,
      explain: "Pipeline xanh không chứng minh môi trường thật chạy được. Cần smoke test ngay sau deploy, kiểm tra biến môi trường và kết nối thật, đồng thời rà lại khóa cache. Tắt cache chỉ làm chậm; unit test không bắt được lỗi cấu hình môi trường."
    },
    {
      id: "p10",
      tag: "CI",
      title: "Pipeline 45 phút bị lách",
      scenario: "Bộ kiểm tra mất 45 phút vì chạy tuần tự, không cache và chạy toàn bộ test trên mọi commit. Lập trình viên bắt đầu merge khi cổng còn đỏ vì cho rằng lỗi sẽ tự hết.",
      metrics: [
        { label: "Thời gian", value: "45 phút", danger: true },
        { label: "Song song", value: "không" },
        { label: "Cache", value: "không" },
        { label: "Bỏ qua cổng", value: "tăng", danger: true }
      ],
      options: [
        "Tăng timeout để pipeline có thêm thời gian",
        "Chạy song song các nhóm test, cache dependency và đưa kiểm tra nhanh lên trước",
        "Bỏ test tích hợp vào cuối tuần",
        "Cho phép merge khi chỉ có test chậm còn đỏ"
      ],
      correct: 1,
      explain: "Thời gian phản hồi dài là nguyên nhân khiến người ta lách cổng. Song song hóa, cache đúng khóa và sắp xếp kiểm tra nhanh trước giúp giảm thời gian mà không giảm độ phủ. Bỏ test hoặc cho merge đỏ là nới cổng, không phải tối ưu."
    },
    {
      id: "p11",
      tag: "CD",
      title: "Canary 5% có tỉ lệ lỗi gấp ba",
      scenario: "Canary v42 nhận 5% lưu lượng. Sau 10 phút, tỉ lệ lỗi là 1,8% so với 0,3% của v41; p95 tăng từ 180 ms lên 320 ms. Chưa có manh mối nguyên nhân nhưng lưu lượng đủ lớn để kết luận.",
      metrics: [
        { label: "Lưu lượng", value: "5%" },
        { label: "Lỗi v42", value: "1,8%", danger: true },
        { label: "Lỗi v41", value: "0,3%" },
        { label: "p95", value: "320 ms", danger: true }
      ],
      options: [
        "Tăng lên 50% để có thêm dữ liệu",
        "Dừng canary, đưa lưu lượng về v41 rồi điều tra trên bản sao",
        "Khởi động lại các pod v42 và tiếp tục tăng tải",
        "Tắt cảnh báo trong lúc điều tra cho đỡ nhiễu"
      ],
      correct: 1,
      explain: "Khi canary tệ hơn baseline rõ rệt, ưu tiên giảm phơi nhiễm: rollback lưu lượng rồi điều tra. Tăng lên 50% làm nhiều người dùng gặp lỗi hơn. Khởi động lại có thể che triệu chứng; tắt cảnh báo làm mất dữ liệu quan trọng."
    },
    {
      id: "p12",
      tag: "CD",
      title: "Rollback bị chặn bởi migration",
      scenario: "Bản v42 chạy migration đổi tên cột và xóa cột cũ. Khi cần rollback về v41, mã cũ không đọc được dữ liệu mới. Nhóm phải chọn cách sửa quy trình để lần sau rollback không bị chặn.",
      metrics: [
        { label: "Migration", value: "phá vỡ", danger: true },
        { label: "Rollback", value: "bị chặn", danger: true },
        { label: "Dữ liệu", value: "đã đổi" },
        { label: "Phiên bản cũ", value: "v41" }
      ],
      options: [
        "Luôn sao lưu database trước mỗi deploy và phục hồi khi lỗi",
        "Dùng expand-contract: thêm cột mới, ghi cả hai, chuyển đọc rồi mới xóa cột cũ ở lần sau",
        "Chỉ cho phép rollback khi chưa có người dùng",
        "Đổi tên cột nhanh hơn để giảm thời gian migration"
      ],
      correct: 1,
      explain: "Expand-contract giữ cả phiên bản cũ và mới cùng đọc ghi được trong một khoảng chuyển tiếp, nhờ đó rollback binary vẫn an toàn. Phục hồi database từ backup có thể mất dữ liệu phát sinh và rất chậm; giới hạn rollback theo người dùng không giải quyết gốc."
    }
  );

  SL.cheatsheets.push({
    id: "delivery",
    num: "07",
    title: "Git & CI",
    intro: "Những lệnh và điểm kiểm tra dùng hằng ngày khi đưa thay đổi từ máy cá nhân ra production.",
    cards: [
      {
        title: "Lệnh Git thường dùng",
        wide: true,
        html: '<table class="cheat-table"><thead><tr><th>Việc cần làm</th><th>Lệnh</th><th>Ghi chú</th></tr></thead><tbody><tr><td>Xem trạng thái</td><td class="mono">git status</td><td>Biết tệp nào đã stage, tệp nào chưa.</td></tr><tr><td>Chọn từng khối</td><td class="mono">git add -p</td><td>Commit nhỏ, một ý rõ ràng.</td></tr><tr><td>Tạo nhánh</td><td class="mono">git switch -c ten-nhanh</td><td>Nhánh chỉ là nhãn tại commit hiện tại.</td></tr><tr><td>Xem lịch sử</td><td class="mono">git log --graph --oneline</td><td>Thấy điểm tách và merge.</td></tr><tr><td>Hợp nhánh</td><td class="mono">git merge feature</td><td>Fast-forward hoặc merge commit.</td></tr><tr><td>Cứu commit</td><td class="mono">git reflog</td><td>Tìm lại vị trí HEAD đã đi qua.</td></tr><tr><td>Bỏ thay đổi tệp</td><td class="mono">git restore ten-tep</td><td>Chỉ ảnh hưởng working tree.</td></tr></tbody></table>'
      },
      {
        title: "Checklist trước khi merge",
        html: '<div class="check-list"><span>Pipeline xanh trên đúng commit.</span><span>Không có bí mật trong diff.</span><span>Migration tương thích ngược.</span><span>Có test cho lỗi vừa sửa.</span><span>Thông điệp commit giải thích vì sao.</span></div>'
      },
      {
        title: "Checklist phát hành",
        html: '<div class="check-list"><span>Artifact bất biến, đúng mã băm.</span><span>Smoke test trên staging.</span><span>Canary có ngưỡng rollback trước khi chạy.</span><span>Giám sát lỗi, độ trễ và chỉ số nghiệp vụ.</span><span>Đường lùi đã được thử ít nhất một lần.</span></div>'
      }
    ]
  });
})(window.SCALELAB);
