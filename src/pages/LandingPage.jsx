import { SoccerBallBackground } from '../assets/SoccerBallBackground'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import MarqueeStrip from '../components/MarqueeStrip'
import HowItWorks from '../components/HowItWorks'
import SportsShowcase from '../components/SportsShowcase'
import RulesTeaser from '../components/RulesTeaser'
import FinalCTA from '../components/FinalCTA'
import Footer from '../components/Footer'
import BottomNav from '../components/BottomNav'

export default function LandingPage() {
    return (
        <>
            {/* ① Soccer ball — fixed behind everything, spins on scroll via GSAP */}
            <SoccerBallBackground />

            {/* ② All page content — sits above the ball via z-index */}
            <div style={{ position: 'relative', zIndex: 1 }}>
                <Navbar />
                <HeroSection />
                <MarqueeStrip />
                <HowItWorks />
                <SportsShowcase />
                <RulesTeaser />
                <FinalCTA />
                <Footer />
                <BottomNav />
            </div>
        </>
    )
}
