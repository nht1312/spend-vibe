import { usePageMeta } from '../hooks/usePageMeta'

// Guide 1: tập trung vào "quản lý chi tiêu không stress"
export const GuideCalmSpending = () => {
  usePageMeta({
    title: 'Quản lý chi tiêu không stress • Hướng đi nhẹ nhàng',
    description:
      'Vì sao quản lý chi tiêu thường làm chúng ta mệt, và một góc nhìn nhẹ nhàng hơn về tiền bạc – không cần soi từng hoá đơn.',
  })

  return (
    <>
      <article className="prose prose-sm max-w-none text-slate-800 prose-p:leading-relaxed">
        <h1>Quản lý chi tiêu nhưng lúc nào cũng thấy mệt?</h1>
        <p>
          Có thể bạn đã thử rất nhiều cách: ghi chép từng khoản, tải đủ loại app, lập file Excel
          đầy màu sắc. Nhưng càng cố gắng “quản lý chi tiêu”, bạn lại càng thấy… mệt.
        </p>
        <p>
          Không phải vì bạn tiêu hoang. Mà vì cách chúng ta đang cố kiểm soát tiền thường quá căng,
          quá chi tiết, và không hợp với nhịp sống thật.
        </p>
        <h2>Vì sao cách quản lý truyền thống dễ khiến chúng ta quá tải?</h2>
        <p>
          Ghi lại từng lần quẹt thẻ nghe có vẻ khoa học, nhưng thực tế là não bạn phải chạm vào
          tiền liên tục trong ngày. Mỗi ly cafe, mỗi cuốc xe đều trở thành “một task nữa cần ghi”.
        </p>
        <p>
          Về mặt dữ liệu, bạn có bức tranh rất đầy đủ. Nhưng về mặt cảm xúc, bạn đang liên tục
          nhắc mình rằng “tiền là vấn đề cần được kiểm soát chặt”. Điều này dễ tạo cảm giác thiếu
          an toàn hơn là bình an.
        </p>
        <h2>Một hướng tiếp cận dịu hơn</h2>
        <p>
          Thay vì cố nắm từng con số, bạn có thể bắt đầu từ những câu hỏi nhẹ nhàng hơn:
        </p>
        <ul>
          <li>Tháng này, tài chính của mình đang &quot;thoải mái&quot;, &quot;bình thường&quot;
            hay &quot;hơi căng&quot;?</li>
          <li>3–6 tháng gần đây, mình có đang tiết kiệm được thêm một chút không?</li>
        </ul>
        <p>
          Khi chuyển từ “chi tiết tuyệt đối” sang “trạng thái”, não bớt phải gồng giữ, nhưng bạn
          vẫn có đủ thông tin để điều chỉnh cuộc sống.
        </p>
        <h2>Khi nào một công cụ có thể giúp (nhưng không ép phải dùng)</h2>
        <p>
          Bạn hoàn toàn có thể tự chia tiền theo từng “vùng” lớn trong đầu: chi cố định, chi thiết
          yếu, chi giải trí, tiết kiệm, và một vùng &quot;tiêu cho vui&quot;. Nhưng nếu bạn muốn
          một công cụ nhắc nhẹ:
        </p>
        <ul>
          <li>Nhịp chi tiêu tháng này đang thoải mái, bình thường hay hơi nhanh</li>
          <li>Vùng chi tiêu nào cần được mình &quot;dịu lại&quot; một chút</li>
        </ul>
        <p>
          …thì một ứng dụng được thiết kế với tinh thần &quot;calm&quot; và không phán xét có thể
          giúp giảm tải cho đầu óc. Nó không thay bạn quyết định, chỉ làm bức tranh trở nên dễ đọc
          hơn.
        </p>
        <p>
          Nếu bạn tò mò, bạn có thể thử xem trạng thái tài chính của mình theo tuần hoặc theo
          tháng, thay vì kiểm đếm từng chi tiêu trong ngày. Nếu không, chỉ riêng việc ngồi xuống
          và viết ra 4–5 &quot;vùng chi tiêu&quot; của riêng bạn cũng đã là một bước tiến rất xa.
        </p>
      </article>
    </>
  )
}


