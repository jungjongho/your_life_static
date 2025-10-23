import Link from 'next/link'
import type { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { type Locale, getDictionary } from '@/dictionaries'

export async function generateMetadata({
  params,
}: {
  params: { lang: Locale }
}): Promise<Metadata> {
  const dict = await getDictionary(params.lang)

  return {
    title: 'Fertility Blog - Pregnancy & Ovulation Guide | Babyseed',
    description: 'Expert guides on fertility, ovulation signs, pregnancy tips, and conception advice',
    keywords: 'fertility blog, ovulation guide, pregnancy tips, conception advice, ttc guide',
  }
}

// Get all blog posts from markdown files for a specific language
function getAllBlogPosts(lang: Locale) {
  const blogDirectory = path.join(process.cwd(), 'content/blog', lang)

  // Check if directory exists
  if (!fs.existsSync(blogDirectory)) {
    return []
  }

  const filenames = fs.readdirSync(blogDirectory)

  const posts = filenames
    .filter(filename => filename.endsWith('.md'))
    .map(filename => {
      const slug = filename.replace(/\.md$/, '')
      const fullPath = path.join(blogDirectory, filename)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)

      return {
        slug,
        title: data.title,
        description: data.description,
        date: data.date,
        readTime: data.readTime,
        category: data.category,
      }
    })

  // Sort by date (newest first)
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// Helper function to get emoji by category
function getCategoryEmoji(category: string) {
  const emojiMap: Record<string, string> = {
    'Ovulation': '🌸',
    'Nutrition': '🥗',
    'TTC Guide': '💑',
    'Tracking': '📅',
    'Fertility': '🌱',
  }
  return emojiMap[category] || '📝'
}

export default async function BlogIndex({ params }: { params: { lang: Locale } }) {
  const dict = await getDictionary(params.lang)
  const blogPosts = getAllBlogPosts(params.lang)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link
            href={`/${params.lang}`}
            className="text-pink-600 hover:text-pink-700 mb-4 inline-flex items-center text-sm font-medium"
          >
            ← Back to Fertility Calculator
          </Link>
          <h1 className="text-5xl font-bold text-gray-900 mb-4 mt-4">
            Fertility Blog
          </h1>
          <p className="text-xl text-gray-600">
            Expert guides on ovulation, pregnancy, and fertility
          </p>
        </div>

        {blogPosts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <p className="text-xl text-gray-600">No blog posts available in this language yet.</p>
            <p className="text-gray-500 mt-4">Please check back later or switch to another language.</p>
          </div>
        ) : (
          <>
            {/* Featured Post (first post) */}
            {blogPosts.length > 0 && (
              <div className="mb-12">
                <Link
                  href={`/${params.lang}/blog/${blogPosts[0].slug}`}
                  className="block bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow group"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="aspect-video md:aspect-square bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center">
                      <span className="text-6xl">{getCategoryEmoji(blogPosts[0].category)}</span>
                    </div>
                    <div className="p-8 flex flex-col justify-center">
                      <span className="px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-sm font-medium w-fit mb-4">
                        ⭐ Featured
                      </span>
                      <h2 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-pink-600 transition-colors">
                        {blogPosts[0].title}
                      </h2>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {blogPosts[0].description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{blogPosts[0].date}</span>
                        <span>•</span>
                        <span>{blogPosts[0].readTime}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Blog Posts Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {blogPosts.slice(1).map((post) => (
                <Link
                  key={post.slug}
                  href={`/${params.lang}/blog/${post.slug}`}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden group"
                >
                  {/* Image Placeholder */}
                  <div className="aspect-video bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                    <span className="text-5xl">{getCategoryEmoji(post.category)}</span>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium">
                        {post.category}
                      </span>
                      <div className="text-xs text-gray-500 flex items-center gap-2">
                        <span>{post.readTime}</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-pink-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4">
                      {post.description}
                    </p>

                    <div className="text-sm text-gray-500">
                      {post.date}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-2xl p-10 text-white text-center">
          <h3 className="text-3xl font-bold mb-4">
            Ready to Calculate Your Fertile Window?
          </h3>
          <p className="text-lg mb-8 opacity-90">
            Use our free fertility calculator to find your most fertile days and maximize your chances of conception
          </p>
          <Link
            href={`/${params.lang}`}
            className="inline-block bg-white text-pink-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            Calculate Fertile Days →
          </Link>
        </div>

        {/* Newsletter Signup (Optional Future Feature) */}
        <div className="mt-12 bg-white rounded-xl shadow-md p-8 text-center">
          <h4 className="text-2xl font-bold text-gray-900 mb-3">
            Get Fertility Tips Weekly
          </h4>
          <p className="text-gray-600 mb-6">
            Subscribe to our newsletter for expert advice, tips, and updates
          </p>
          <div className="max-w-md mx-auto flex gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              disabled
            />
            <button
              className="px-6 py-3 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 transition-colors opacity-50 cursor-not-allowed"
              disabled
            >
              Coming Soon
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
