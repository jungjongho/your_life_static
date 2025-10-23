import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import { type Locale } from '@/dictionaries'

// Helper function to get all blog post slugs for a language
function getAllBlogSlugs(lang: Locale): string[] {
  const blogDirectory = path.join(process.cwd(), 'content/blog', lang)

  if (!fs.existsSync(blogDirectory)) {
    return []
  }

  const filenames = fs.readdirSync(blogDirectory)
  return filenames
    .filter(filename => filename.endsWith('.md'))
    .map(filename => filename.replace(/\.md$/, ''))
}

// Helper function to get blog post data
async function getBlogPost(slug: string, lang: Locale) {
  const blogDirectory = path.join(process.cwd(), 'content/blog', lang)
  const fullPath = path.join(blogDirectory, `${slug}.md`)

  if (!fs.existsSync(fullPath)) {
    return null
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  // Convert markdown to HTML
  const processedContent = await remark().use(html).process(content)
  const contentHtml = processedContent.toString()

  return {
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    readTime: data.readTime,
    author: data.author,
    category: data.category,
    contentHtml,
  }
}

// Helper function to get all blog posts metadata
function getAllBlogPosts(lang: Locale) {
  const slugs = getAllBlogSlugs(lang)
  return slugs.map(slug => {
    const blogDirectory = path.join(process.cwd(), 'content/blog', lang)
    const fullPath = path.join(blogDirectory, `${slug}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data } = matter(fileContents)

    return {
      slug,
      title: data.title,
      description: data.description,
      category: data.category,
    }
  })
}

export async function generateStaticParams() {
  const locales: Locale[] = ['en', 'ko', 'es']
  const params: { lang: Locale; slug: string }[] = []

  for (const lang of locales) {
    const slugs = getAllBlogSlugs(lang)
    slugs.forEach(slug => {
      params.push({ lang, slug })
    })
  }

  return params
}

export async function generateMetadata({
  params
}: {
  params: { slug: string; lang: Locale }
}): Promise<Metadata> {
  const post = await getBlogPost(params.slug, params.lang)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: `${post.title} | Babyseed Blog`,
    description: post.description,
    keywords: `fertility, ovulation, pregnancy, conception, ${post.category.toLowerCase()}`,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    }
  }
}

export default async function BlogPost({
  params
}: {
  params: { slug: string; lang: Locale }
}) {
  const post = await getBlogPost(params.slug, params.lang)

  if (!post) {
    notFound()
  }

  // Get related posts (other posts, excluding current)
  const allPosts = getAllBlogPosts(params.lang)
  const relatedPosts = allPosts
    .filter(p => p.slug !== params.slug)
    .slice(0, 4)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-12 px-4">
      <article className="max-w-4xl mx-auto">
        {/* Back Link */}
        <Link
          href={`/${params.lang}/blog`}
          className="text-pink-600 hover:text-pink-700 mb-8 inline-flex items-center text-sm font-medium"
        >
          ← Back to Blog
        </Link>

        {/* Article Header */}
        <header className="mb-12 mt-6">
          <div className="flex items-center gap-4 mb-6">
            <span className="px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">
              {post.category}
            </span>
            <span className="text-gray-500 text-sm">{post.readTime}</span>
          </div>

          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            {post.title}
          </h1>

          <p className="text-xl text-gray-600 mb-6">
            {post.description}
          </p>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>By {post.author}</span>
            <span>•</span>
            <time dateTime={post.date}>{post.date}</time>
          </div>
        </header>

        {/* Article Content */}
        <div className="bg-white rounded-2xl shadow-lg p-12 mb-12">
          <div
            className="blog-content prose prose-lg max-w-none
              [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mt-8 [&_h1]:mb-6 [&_h1]:text-gray-900
              [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:text-gray-900
              [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:text-gray-900
              [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-gray-700
              [&_ul]:ml-6 [&_ul]:mb-4 [&_ul]:list-disc
              [&_ol]:ml-6 [&_ol]:mb-4 [&_ol]:list-decimal
              [&_li]:mb-2 [&_li]:leading-relaxed
              [&_strong]:font-semibold [&_strong]:text-gray-900
              [&_blockquote]:border-l-4 [&_blockquote]:border-pink-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-6 [&_blockquote]:text-gray-600
              [&_table]:w-full [&_table]:border-collapse [&_table]:my-6
              [&_th]:border [&_th]:border-gray-300 [&_th]:p-3 [&_th]:bg-gray-50 [&_th]:font-semibold [&_th]:text-left
              [&_td]:border [&_td]:border-gray-300 [&_td]:p-3 [&_td]:text-left
              [&_hr]:my-8 [&_hr]:border-t [&_hr]:border-gray-300
              [&_code]:bg-gray-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-2xl p-10 text-white text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">
            Ready to Track Your Fertility?
          </h3>
          <p className="text-lg mb-8 opacity-90">
            Use our free fertility calculator to predict your ovulation and maximize your chances of conception
          </p>
          <Link
            href={`/${params.lang}`}
            className="inline-block bg-white text-pink-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            Calculate Your Fertile Window →
          </Link>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-8">
            <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/${params.lang}/blog/${relatedPost.slug}`}
                  className="p-4 border border-gray-200 rounded-lg hover:border-pink-300 hover:shadow-md transition-all"
                >
                  <span className="text-xs text-pink-600 font-medium mb-2 block">
                    {relatedPost.category}
                  </span>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {relatedPost.title}
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {relatedPost.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  )
}
