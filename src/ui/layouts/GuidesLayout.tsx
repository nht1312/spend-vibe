import { Link, Outlet } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'

// Layout cho các trang Guide SEO – tách biệt khỏi app chính.
// Mục tiêu: đọc thoải mái, không cảm giác sales hay dashboard.
export const GuidesLayout = () => {
  usePageMeta({
    title: 'Hướng dẫn tài chính nhẹ nhàng • Spend Vibe',
    description:
      'Những hướng dẫn về quản lý chi tiêu và tài chính cá nhân theo cách nhẹ nhàng, không phán xét.',
  })

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-4">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Guides</p>
            <h1 className="text-xl font-semibold text-slate-900">
              Góc đọc về tiền bạc nhẹ nhàng
            </h1>
          </div>
          <Link
            to="/"
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm"
          >
            Về lại ứng dụng
          </Link>
        </header>

        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <Outlet />
        </section>
      </div>
    </main>
  )
}


