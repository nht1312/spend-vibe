import { usePageMeta } from '../hooks/usePageMeta'

// Guide 2: tập trung vào tài chính vợ chồng / cặp đôi, giữ giọng trung tính và an toàn.
export const GuideCoupleFinance = () => {
  usePageMeta({
    title: 'Quản lý tài chính vợ chồng mà không cãi nhau',
    description:
      'Vì sao tiền bạc dễ làm vợ chồng căng thẳng, và một cách tiếp cận nhẹ nhàng hơn: nhìn chung một bức tranh, không biến dữ liệu thành bằng chứng.',
  })

  return (
    <>
      <article className="prose prose-sm max-w-none text-slate-800 prose-p:leading-relaxed">
        <h1>Quản lý tài chính vợ chồng mà không biến thành bảng điểm</h1>
        <p>
          Tiền bạc là một trong những lý do khiến nhiều cặp đôi tranh cãi – không phải vì ai đó xấu,
          mà vì cách chúng ta nói chuyện về tiền thường thiếu an toàn. Mỗi người mang theo một lịch
          sử, một nỗi sợ, một kiểu nhìn khác nhau về tiền.
        </p>
        <p>
          Khi ghép hai thế giới đó lại, cộng thêm hóa đơn, khoản vay, áp lực cuộc sống…, chuyện &quot;cảm thấy
          khó thở&quot; với tài chính chung là điều rất bình thường.
        </p>
        <h2>Vì sao tài chính chung dễ trở thành chỗ nhạy cảm?</h2>
        <p>
          Nhiều cặp đôi bắt đầu bằng việc &quot;minh bạch tất cả&quot;: ai tiêu gì, bao nhiêu, khi nào.
          Ý tưởng nghe hợp lý, nhưng dễ tạo ra cảm giác:
        </p>
        <ul>
          <li>Lúc nào cũng có thể bị hỏi lại: &quot;khoản này là gì?&quot;</li>
          <li>Tiền chi cho bản thân trở nên &quot;đáng ngại&quot; hơn</li>
          <li>Dữ liệu chi tiêu có thể bị dùng lại trong lúc cãi nhau</li>
        </ul>
        <p>
          Khi đó, công cụ quản lý tài chính – dù là sổ tay hay app – vô tình trở thành một dạng
          &quot;camera giám sát&quot;. Và không ai thật sự thoải mái dưới một chiếc camera, kể cả khi mình
          không làm gì sai.
        </p>
        <h2>Một góc nhìn khác: tiền là chung, người là riêng</h2>
        <p>
          Một nguyên tắc đơn giản nhưng mạnh:
        </p>
        <p className="italic">
          &quot;Tiền là chung, nhưng cảm xúc và lựa chọn cá nhân vẫn cần không gian riêng.&quot;
        </p>
        <p>
          Thay vì truy dấu &quot;ai đã tiêu gì&quot;, hai người có thể cùng nhìn vào:
        </p>
        <ul>
          <li>Tháng này chi chung cho nhà, ăn uống, di chuyển… đang ổn hay hơi căng</li>
          <li>Quỹ tiết kiệm chung đang đi lên hay đi xuống</li>
          <li>Cả nhà muốn sống &quot;thoải mái hơn&quot; hay &quot;giữ chặt hơn&quot; trong 1–2 tháng tới</li>
        </ul>
        <p>
          Vùng chi tiêu &quot;cho riêng mình&quot; – kiểu như mua sách, tự thưởng một món đồ nhỏ – có thể
          được để trong một khoảng &quot;Free&quot; riêng, không đồng bộ, không báo cáo. Không phải vì muốn
          giấu nhau, mà vì **ai cũng cần một góc tự do nhỏ để không cảm thấy mình bị soi mãi**.
        </p>
        <h2>Khi nào nên để một công cụ đứng giữa?</h2>
        <p>
          Nếu bạn thấy mỗi lần nói về tiền là một lần căng, một công cụ rất tối giản có thể đóng vai
          trò &quot;tấm bảng chung&quot;:
        </p>
        <ul>
          <li>Cho cả hai cùng thấy trạng thái tài chính chung tháng này</li>
          <li>Nhận ra vùng nào đang tiến gần giới hạn mà không chỉ mặt ai</li>
          <li>Giúp bắt đầu câu chuyện tiền bạc bằng con số trung lập, không bằng cảm xúc nóng</li>
        </ul>
        <p>
          Quan trọng là công cụ đó:
        </p>
        <ul>
          <li>Không hiển thị danh sách &quot;ai chi gì&quot;</li>
          <li>Không gửi thông báo kiểu &quot;người kia vừa tiêu…&quot;</li>
          <li>Không chấm điểm, không xếp hạng</li>
        </ul>
        <p>
          Khi đó, app chỉ là một tấm bản đồ chung. Còn việc đi như thế nào, nói chuyện ra sao,
          vẫn là quyết định của hai người.
        </p>
        <p>
          Nếu một ngày bạn thấy chuyện tiền trở nên quá ồn ào, có thể đơn giản quay lại vùng Weekly
          hoặc Monthly của mình, nhìn một vòng, và tạm thống nhất: &quot;Tháng này tụi mình sống hơi nhanh
          nhưng vẫn ổn. Tháng sau tụi mình dịu nhịp một chút nhé.&quot;
        </p>
      </article>
    </>
  )
}


