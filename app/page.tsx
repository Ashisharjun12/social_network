import Link from 'next/link'
import Image from 'next/image'
import Avatar from '@/components/common/Avatar'

// Add this function at the top of your file to generate avatar URL
function getAvatarUrl(seed: string) {
  return `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${encodeURIComponent(seed)}&backgroundColor=4D61FC,FF4B91,00D8B4`;
}

export default function Home() {
  return (
    <div className="min-h-screen bg-dark overflow-hidden">
      {/* Enhanced Background */}
      <div className="fixed inset-0 dot-pattern opacity-20"></div>
      <div className="fixed inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10"></div>

      <div className="relative">
        <div className="container mx-auto px-4 py-16">
          {/* Live Activity Indicator */}
          <div className="fixed top-4 right-4 flex items-center gap-2 bg-surface/80 p-2 rounded-full animate-pulse">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span className="text-sm text-gray-300">2,481 students online now</span>
          </div>

          {/* Hero Section */}
          <div className="text-center space-y-8 max-w-4xl mx-auto mb-24">
            <div className="animate-float space-y-6">
              {/* Trust Badges */}
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                <Badge text="🔒 100% Anonymous Forever" />
                <Badge text="🎓 50K+ Active Users" />
                <Badge text="⚡ Join in 30 Seconds" />
              </div>
              
              {/* Main Headline */}
              <h1 className="text-6xl md:text-7xl font-bold leading-tight">
                Your College Life.
                <span className="gradient-text block mt-2">Unfiltered & Real.</span>
                <span className="text-xl font-normal text-gray-400 block mt-6 max-w-2xl mx-auto">
                  Join the fastest-growing anonymous social network where college students share what they can't on Instagram or LinkedIn.
                </span>
              </h1>

              {/* Social Proof Ticker */}
              <div className="bg-surface/50 p-3 rounded-lg mt-8 overflow-hidden">
                <div className="animate-slideLeft flex gap-4 text-sm text-gray-300">
                  <span>🎭 @NightOwl_42 just shared a secret</span>
                  <span>💡 New study tips trending</span>
                  <span>💘 Campus romance story blowing up</span>
                  <span>📚 Study group forming for finals</span>
                </div>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <a href="/register" className="btn-primary group">
                  Create Your Secret Identity
                  <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform">→</span>
                </a>
                <a href="/explore" className="btn-secondary group flex items-center justify-center">
                  <span>Preview Top Stories</span>
                  <span className="ml-2 text-xs">(No Account Needed)</span>
                </a>
              </div>
            </div>
          </div>

          {/* Trending Topics Section - Moved up and redesigned */}
          <div className="mb-24 text-center">
            <h2 className="text-3xl font-bold mb-12 gradient-text">What's Trending Now</h2>
            <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
              <TrendingTopic 
                icon="🎭"
                text="Confessions"
                count="2.3k"
                gradient="from-blue-500/20 to-purple-500/20"
              />
              <TrendingTopic 
                icon="💘"
                text="Campus Life"
                count="1.8k"
                gradient="from-pink-500/20 to-red-500/20"
              />
              <TrendingTopic 
                icon="📚"
                text="Study Tips"
                count="3.2k"
                gradient="from-green-500/20 to-emerald-500/20"
              />
              <TrendingTopic 
                icon="🌟"
                text="Success Stories"
                count="2.1k"
                gradient="from-purple-500/20 to-pink-500/20"
              />
            </div>

            {/* Popular Tags */}
            <div className="flex flex-wrap justify-center gap-3 mt-8 max-w-3xl mx-auto">
              {[
                'Campus Life', 'Study Tips', 'Confessions',
                'Student Hacks', 'Friend Groups', 'Events',
                'College Tips', 'Late Night Stories'
              ].map((tag) => (
                <span 
                  key={tag}
                  className="px-4 py-2 bg-surface/50 rounded-full text-sm text-gray-300 hover:bg-primary/20 transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Trending Now Section */}
          <div className="mb-24">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                🔥 Trending Now
                <span className="text-sm text-primary animate-pulse px-3 py-1 rounded-full bg-primary/10">
                  Live Feed
                </span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Meme Central */}
              <TrendingCard 
                category="Meme Central"
                title="When the professor says 'pop quiz' on Monday morning... 😫"
                engagement="4.2k students laughing"
                timeAgo="5m ago"
                gradient="from-purple-500/20 to-pink-500/20"
                icon="😂"
              />
              
              {/* Campus Life */}
              <TrendingCard 
                category="Campus Life"
                title="The unspoken rules of library seat reservation..."
                engagement="2.1k students relating"
                timeAgo="15m ago"
                gradient="from-blue-500/20 to-cyan-500/20"
                icon="📚"
              />
              
              {/* Late Night Thoughts */}
              <TrendingCard 
                category="Late Night Thoughts"
                title="Why do vending machines never have what you want at 3 AM?"
                engagement="1.8k night owls active"
                timeAgo="32m ago"
                gradient="from-green-500/20 to-emerald-500/20"
                icon="🌙"
              />
            </div>

            {/* Meme Categories */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              <MemeCategory 
                icon="😂"
                title="Campus Memes"
                count="5.2k"
                gradient="from-pink-500/20 to-purple-500/20"
              />
              <MemeCategory 
                icon="🤓"
                title="Study Life"
                count="3.8k"
                gradient="from-blue-500/20 to-indigo-500/20"
              />
              <MemeCategory 
                icon="🍕"
                title="Hostel Life"
                count="4.1k"
                gradient="from-green-500/20 to-teal-500/20"
              />
              <MemeCategory 
                icon="👩‍🏫"
                title="Professor Moments"
                count="3.5k"
                gradient="from-orange-500/20 to-red-500/20"
              />
            </div>
          </div>

          {/* Social Proof Wall */}
          <div className="mb-24">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <span>💬</span> Real Student Stories
              <span className="text-sm text-primary animate-pulse ml-2">(Live Feed)</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StudentStory 
                username="CoffeeNinja_23"
                content="Found this hidden study spot in the library's top floor. Perfect lighting and zero distractions! 📚✨"
                timeAgo="2m"
                tags={["StudySpot", "LibrarySecrets"]}
              />
              <StudentStory 
                username="SleepyPanda_99"
                content="Late night food thread is pure gold! That 24/7 ramen place is a lifesaver during finals 🍜"
                timeAgo="5m"
                tags={["FoodFinds", "NightOwl"]}
              />
              <StudentStory 
                username="BookWorm_404"
                content="Our anonymous study group went from 3 to 30 people! Everyone's helping each other ace finals 🎯"
                timeAgo="12m"
                tags={["StudySquad", "TeamWork"]}
              />
              <StudentStory 
                username="MidnightOwl_42"
                content="Those exam tips from seniors = instant GPA boost! Thank you anonymous heroes! 🌟"
                timeAgo="15m"
                tags={["Success", "GradeGoals"]}
              />
            </div>
            
            {/* Add a "View More" button */}
            <div className="text-center mt-8">
              <button className="btn-secondary group inline-flex items-center gap-2">
                View More Stories
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          </div>

          {/* FOMO Section */}
          <div className="mb-24 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl p-8">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">What You're Missing Right Now</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <MissingItem 
                  icon="🎭"
                  number="23"
                  text="Anonymous confessions shared today"
                />
                <MissingItem 
                  icon="💡"
                  number="45"
                  text="Study tips and tricks"
                />
                <MissingItem 
                  icon="🤝"
                  number="12"
                  text="Study groups forming"
                />
                <MissingItem 
                  icon="📝"
                  number="89"
                  text="Course reviews posted"
                />
              </div>
              <a href="/register" className="btn-primary inline-block">
                Join the Community
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* App Coming Soon */}
      <div className="border-t border-white/10 py-24 bg-gradient-to-b from-dark to-surface">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto relative">
            {/* Decorative Elements */}
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full w-32 h-32"></div>
                <span className="relative text-6xl animate-bounce">📱</span>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-4xl font-bold">
                Mobile App
                <span className="gradient-text block mt-2">Coming Soon</span>
              </h2>
              
              <p className="text-gray-400 text-lg max-w-xl mx-auto">
                Take the anonymous experience with you. Share thoughts and connect anywhere, anytime.
              </p>

              {/* Waitlist Form */}
              <div className="bg-surface/50 p-8 rounded-2xl border border-white/10 max-w-md mx-auto mt-8">
                <div className="flex gap-3">
                  <input 
                    type="email" 
                    placeholder="Enter your email for early access" 
                    className="flex-1 px-4 py-3 rounded-xl bg-dark border border-white/10 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                  />
                  <button className="btn-primary whitespace-nowrap hover:scale-105 transition-transform">
                    Get Notified
                  </button>
                </div>
                
                {/* Social Proof */}
                <div className="mt-4 flex items-center justify-center gap-6 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span>834 on waitlist</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🎁</span>
                    <span>Early access perks</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Badge({ text }: { text: string }) {
  return (
    <span className="inline-block px-4 py-2 rounded-full bg-surface/80 border border-white/10 text-white text-sm font-medium">
      {text}
    </span>
  )
}

function TrendingCard({ 
  category, 
  title, 
  engagement, 
  timeAgo, 
  gradient,
  icon 
}: { 
  category: string; 
  title: string; 
  engagement: string;
  timeAgo: string;
  gradient: string;
  icon?: string;
}) {
  return (
    <div className={`feature-card bg-gradient-to-br ${gradient} group cursor-pointer hover:scale-105 transition-all duration-300`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon && <span className="text-xl">{icon}</span>}
          <span className="text-sm text-primary">{category}</span>
        </div>
        <span className="text-xs text-gray-400">{timeAgo}</span>
      </div>
      <h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <span className="w-2 h-2 bg-primary/50 rounded-full animate-pulse"></span>
        {engagement}
      </div>
    </div>
  )
}

function ReasonCard({ icon, title, description, highlight }: {
  icon: string;
  title: string;
  description: string;
  highlight: string;
}) {
  return (
    <div className="feature-card text-center group">
      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-300 mb-4">{description}</p>
      <span className="inline-block px-3 py-1 bg-primary/20 rounded-full text-primary text-sm">
        {highlight}
      </span>
    </div>
  )
}

function ComingSoonFeature({ icon, title, description }: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center group">
      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  )
}

function StudentStory({ username, content, timeAgo, tags }: {
  username: string;
  content: string;
  timeAgo: string;
  tags: string[];
}) {
  return (
    <div className="feature-card hover:scale-105 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <Avatar username={username} size={40} />
          <div className="flex flex-col">
            <span className="text-primary text-sm font-medium">{username}</span>
            <span className="text-xs text-gray-500">{timeAgo} ago</span>
          </div>
        </div>
      </div>
      <p className="text-gray-300 mb-3">{content}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
            #{tag}
          </span>
        ))}
      </div>
    </div>
  )
}

function MissingItem({ icon, number, text }: {
  icon: string;
  number: string;
  text: string;
}) {
  return (
    <div className="text-center p-4 bg-dark/50 rounded-xl border border-white/10">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-2xl font-bold text-primary mb-1">{number}</div>
      <p className="text-sm text-gray-400">{text}</p>
    </div>
  )
}

function ExclusiveFeature({ icon, title, description, tag }: {
  icon: string;
  title: string;
  description: string;
  tag: string;
}) {
  return (
    <div className="feature-card group">
      <div className="flex items-start justify-between mb-4">
        <div className="text-3xl group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
          {tag}
        </span>
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  )
}

function TopicTag({ text, count }: { text: string; count: string }) {
  return (
    <div className="bg-surface/50 px-4 py-2 rounded-full flex items-center gap-2 hover:bg-primary/20 transition-colors cursor-pointer">
      <span className="text-white">{text}</span>
      <span className="text-xs text-gray-400">{count}</span>
    </div>
  )
}

function TrendingTopic({ icon, text, count, gradient }: {
  icon: string;
  text: string;
  count: string;
  gradient: string;
}) {
  return (
    <div className={`bg-gradient-to-br ${gradient} p-6 rounded-2xl hover:scale-105 transition-all duration-300 cursor-pointer`}>
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold mb-1">{text}</h3>
      <p className="text-sm text-gray-300">{count} posts</p>
    </div>
  )
}

function MemeCategory({ icon, title, count, gradient }: {
  icon: string;
  title: string;
  count: string;
  gradient: string;
}) {
  return (
    <div className={`bg-gradient-to-br ${gradient} p-4 rounded-xl hover:scale-105 transition-all duration-300 cursor-pointer`}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <h3 className="font-medium text-sm">{title}</h3>
          <p className="text-xs text-gray-300">{count} memes</p>
        </div>
      </div>
    </div>
  )
}
