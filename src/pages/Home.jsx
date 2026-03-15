import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    FileText,
    ShieldCheck,
    Zap,
    BarChart3,
    Target,
    Users,
    ArrowRight,
    CheckCircle2,
    XCircle,
    Cpu,
    Search,
    ChevronRight,
    PlayCircle
} from 'lucide-react';
import LandingNavbar from '../components/LandingNavbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/useAuth';
import AnimatedLightBackground from '../components/AnimatedLightBackground';
import AnimatedDarkBackground from '../components/AnimatedDarkBackground';
import PaymentModal from '../components/PaymentModal';
import { useNavigate } from 'react-router-dom';

const FeatureCard = ({ icon: Icon, title, description, delay = "" }) => (
    <div className={`p-10 rounded-[2.5rem] glass-card glass-card-hover group reveal-on-scroll ${delay}`}>
        <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-8 border border-indigo-500/20 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500 shadow-lg group-hover:shadow-indigo-500/40">
                <Icon size={30} />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4 tracking-tight group-hover:text-primary transition-colors">{title}</h3>
            <p className="text-foreground-muted leading-relaxed text-base group-hover:text-foreground transition-colors">
                {description}
            </p>
        </div>
    </div>
);

const StepCard = ({ number, title, description, isLast, delay = "" }) => (
    <div className={`relative group reveal-on-scroll ${delay}`}>
        {!isLast && (
            <div className="hidden lg:block absolute top-12 left-full w-full h-[2px] bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-transparent z-0 -translate-x-8"></div>
        )}
        <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-3xl bg-card border-2 border-border flex items-center justify-center text-2xl font-black text-foreground mb-6 group-hover:border-primary group-hover:bg-primary/10 transition-all duration-500 group-hover:rotate-6">
                {number}
            </div>
            <h4 className="text-xl font-bold text-foreground mb-3 tracking-tight">{title}</h4>
            <p className="text-foreground-muted text-sm max-w-[200px] leading-relaxed font-medium">{description}</p>
        </div>
    </div>
);

const PricingCard = ({ title, price, description, features, isPopular, delay = "", buttonText = "Get Started", linkTo = "/signup", trialText = "", onClick }) => (
    <div className={`relative p-8 rounded-[2.5rem] glass-card glass-card-hover h-full group reveal-on-scroll ${delay} flex flex-col transition-all duration-500 hover:scale-[1.02] ${isPopular ? 'border-primary/50 shadow-[0_0_40px_rgba(99,102,241,0.2)] dark:shadow-[0_0_40px_rgba(99,102,241,0.4)] z-10 hover:shadow-[0_0_60px_rgba(99,102,241,0.3)] ring-2 ring-primary lg:-translate-y-2 hover:-translate-y-4' : 'border-border/50 hover:border-primary/30 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] dark:hover:shadow-[0_0_30px_rgba(99,102,241,0.2)]'}`}>
        {isPopular && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-[0_0_20px_rgba(245,158,11,0.6)] border-[1.5px] border-amber-300/50 whitespace-nowrap animate-pulse">
                ★ Most Popular ★
            </div>
        )}
        <div className="mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-3">{title}</h3>
            <p className="text-foreground-muted text-sm leading-relaxed min-h-[40px]">{description}</p>
        </div>
        <div className="mb-6 flex flex-col gap-2">
            <div className="items-baseline flex gap-1">
                <span className="text-5xl font-black text-foreground">{price}</span>
                {price !== "Custom" && <span className="text-foreground-muted font-bold">/mo</span>}
            </div>
            {trialText && (
                <span className="inline-block text-emerald-500 dark:text-emerald-400 text-xs font-bold bg-emerald-500/10 px-3 py-1.5 rounded-full w-fit border border-emerald-500/20">
                    {trialText}
                </span>
            )}
        </div>
        <div className="flex-1">
            <ul className="space-y-4 mb-8">
                {features.map((feature, idx) => (
                    <li key={idx} className={`flex items-start gap-3 transition-all duration-500 group/item hover:translate-x-1 animate-in fade-in slide-in-from-left-4 ${feature.available ? 'text-foreground-muted hover:text-foreground' : 'text-foreground-muted/40'}`} style={{ animationDelay: `${(idx + 1) * 100}ms`, animationFillMode: 'both' }}>
                        {feature.available ? (
                            <CheckCircle2 className="w-5 h-5 text-indigo-500 dark:text-indigo-400 flex-shrink-0 mt-0.5 group-hover/item:scale-125 transition-transform duration-300 group-hover/item:text-indigo-400" />
                        ) : (
                            <XCircle className="w-5 h-5 text-foreground-muted/30 flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform duration-300" />
                        )}
                        <span className={`text-sm font-medium leading-relaxed transition-colors ${!feature.available && 'line-through decoration-foreground-muted/20'}`}>{feature.text}</span>
                    </li>
                ))}
            </ul>
        </div>
        <button 
            onClick={() => linkTo ? window.location.href = linkTo : onClick()} 
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 overflow-hidden relative group-hover:scale-[1.02] ${isPopular ? 'premium-button text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)]' : 'glass-card border border-border/50 text-foreground hover:bg-indigo-500/5 dark:hover:bg-indigo-500/10 hover:border-indigo-500/30'}`}
        >
            <span className="relative z-10">{buttonText}</span>
            {isPopular && (
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>
            )}
        </button>
    </div>
);

const Home = () => {
    const { user, subscription } = useAuth();
    const navigate = useNavigate();
    const isAuthenticated = !!user;
    const ctaLink = isAuthenticated ? "/admin" : "/signup";
    const ctaText = isAuthenticated ? "Access Dashboard" : "Start Screening Free";

    const [isPaymentModalOpen, setIsPaymentModalOpen] = React.useState(false);
    const [selectedPlan, setSelectedPlan] = React.useState(null);

    const handlePlanSelect = (plan) => {
        console.log("Plan selected in Home.jsx:", plan);
        if (!isAuthenticated) {
            navigate('/signup');
            return;
        }
        setSelectedPlan(plan);
        setIsPaymentModalOpen(true);
    };

    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Once visible, no need to observe again
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const elements = document.querySelectorAll('.reveal-on-scroll');
        elements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <div className="min-h-screen bg-transparent dark:bg-background relative selection:bg-indigo-500/30">
            <AnimatedLightBackground />
            <AnimatedDarkBackground />
            <div className="noise-overlay hidden dark:block"></div>
            <LandingNavbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-24 lg:pt-64 lg:pb-48 overflow-hidden section-fade">
                {/* Dynamic Ambient Glows */}
                <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/15 blur-[120px] rounded-full -z-10 animate-pulse-slow"></div>
                <div className="absolute top-[20%] right-[-5%] w-[500px] h-[500px] bg-purple-600/10 blur-[100px] rounded-full -z-10 animate-float"></div>

                <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-500/5 border border-indigo-500/20 text-indigo-300 text-sm font-bold mb-10 reveal-on-scroll">
                        <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
                        Trusted by 500+ Innovative Teams
                    </div>

                    <div className="headline-glow reveal-on-scroll delay-100">
                        <h1 className="text-6xl lg:text-8xl font-black text-foreground mb-10 tracking-tight leading-[0.95]">
                            Screen Smarter <br />
                            <span className="gradient-text">Hire Effortlessly</span>
                        </h1>
                    </div>

                    <p className="max-w-3xl mx-auto text-xl lg:text-2xl text-foreground-muted mb-14 leading-relaxed font-medium reveal-on-scroll delay-200">
                        The definitive AI-powered recruitment engine. Optimize your talent pipeline with <span className="text-foreground">AI screening</span>, real-time analytics, and automated workflows.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 reveal-on-scroll delay-300">
                        <Link
                            to={ctaLink}
                            className="w-full sm:w-auto px-12 py-5 premium-button rounded-2xl font-bold text-lg flex items-center justify-center gap-3 group"
                        >
                            {ctaText}
                            <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
                        </Link>
                        <button
                            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                            className="w-full sm:w-auto px-12 py-5 glass-card hover:bg-black/5 dark:hover:bg-white/5 text-foreground border border-border rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 group"
                        >
                            <PlayCircle size={24} className="text-indigo-600 dark:text-indigo-400 group-hover:text-foreground transition-colors" />
                            Watch Product Tour
                        </button>
                    </div>

                    {/* App Preview Mockup with Enhanced Glow */}
                    <div className="mt-32 relative max-w-6xl mx-auto reveal-on-scroll delay-500">
                        <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 via-purple-600/20 to-pink-500/20 rounded-[3rem] blur-2xl opacity-50 animate-pulse-slow"></div>
                        <div className="relative glass-card border-white/10 overflow-hidden shadow-2xl p-1 pb-0">
                            <img
                                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426"
                                alt="Dashboard Preview"
                                className="w-full h-auto rounded-[2.3rem] opacity-90 shadow-2xl"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#080c17] via-transparent to-transparent pointer-events-none"></div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="features" className="py-32 relative overflow-hidden bg-transparent section-fade">
                <div className="max-w-7xl mx-auto px-4 lg:px-8">
                    <div className="text-center mb-20 reveal-on-scroll">
                        <h2 className="text-indigo-600 dark:text-indigo-400 font-black tracking-[0.2em] uppercase text-sm mb-5">The Advantage</h2>
                        <h3 className="text-4xl lg:text-6xl font-black text-foreground mb-8 tracking-tight">Built for <span className="gradient-text">Modern Intake</span></h3>
                        <p className="text-foreground-muted max-w-2xl mx-auto text-lg lg:text-xl font-medium">
                            Harness the power of AI-driven analysis to transform your talent acquisition strategy.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 perspective-1000">
                        <FeatureCard
                            icon={Zap}
                            title="Instant ATS Analysis"
                            description="Upload your resume and get immediate technical feedback against industry-standard benchmarks."
                            delay="delay-100"
                        />
                        <FeatureCard
                            icon={Target}
                            title="Smart Job Matching"
                            description="Proprietary AI algorithms calculate semantic similarity between candidates and requirements."
                            delay="delay-200"
                        />
                        <FeatureCard
                            icon={Cpu}
                            title="NLP Deep Insights"
                            description="Utilize advanced LLMs to extract nuanced experience levels and hidden potential."
                            delay="delay-300"
                        />
                        <FeatureCard
                            icon={ShieldCheck}
                            title="Bias-Free Screening"
                            description="Our models prioritize competency and verifiable achievements for equitable hiring."
                            delay="delay-400"
                        />
                        <FeatureCard
                            icon={BarChart3}
                            title="Analytics Dashboard"
                            description="Real-time visualizations of your screening funnel, conversion rates, and metrics."
                            delay="delay-500"
                        />
                        <FeatureCard
                            icon={Users}
                            title="Team Collaboration"
                            description="Multi-user workspaces with role-based access to review and shortlist talent."
                            delay="delay-600"
                        />
                    </div>
                </div>
            </section>

            <section id="how-it-works" className="py-32 relative overflow-hidden bg-transparent section-fade">
                <div className="max-w-7xl mx-auto px-4 lg:px-8">
                    <div className="text-center mb-24 reveal-on-scroll">
                        <h2 className="text-indigo-600 dark:text-indigo-400 font-black tracking-[0.2em] uppercase text-sm mb-5">The Lifecycle</h2>
                        <h3 className="text-4xl lg:text-6xl font-black text-foreground mb-8 tracking-tight">How RecruitAI <span className="gradient-text">Operates</span></h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-12">
                        <StepCard
                            number="01"
                            title="Quick Import"
                            description="Simply drag and drop resumes or job specs in any major format."
                            delay="delay-100"
                        />
                        <StepCard
                            number="02"
                            title="AI Analysis"
                            description="Our engine deconstructs data into high-fidelity knowledge graphs."
                            delay="delay-200"
                        />
                        <StepCard
                            number="03"
                            title="Evaluation"
                            description="Complex scoring models analyze suitability, potential, and cultural fit."
                            delay="delay-300"
                        />
                        <StepCard
                            number="04"
                            title="Smart Decisions"
                            description="Generate ranked shortlists and deep-dive candidate intelligence reports."
                            isLast={true}
                            delay="delay-400"
                        />
                    </div>
                </div>
            </section>

            <section id="pricing" className="py-32 relative overflow-hidden bg-transparent section-fade">
                <div className="max-w-7xl mx-auto px-4 lg:px-8">
                    <div className="text-center mb-20 reveal-on-scroll">
                        <h2 className="text-indigo-600 dark:text-indigo-400 font-black tracking-[0.2em] uppercase text-sm mb-5">Plans & Pricing</h2>
                        <h3 className="text-4xl lg:text-6xl font-black text-foreground mb-8 tracking-tight">Simple, <span className="gradient-text">Transparent</span> Scaling</h3>
                        <p className="text-foreground-muted max-w-2xl mx-auto text-lg lg:text-xl font-medium">
                            Choose the perfect plan to accelerate your hiring workflow with AI-driven precision.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
                        <PricingCard
                            title="Starter"
                            price="Free"
                            description="Perfect for small teams and startups looking to optimize their initial hiring."
                            trialText="Forever Free"
                            features={[
                                { text: "Up to 50 resume screenings / mo", available: true },
                                { text: "Basic AI candidate ranking", available: true },
                                { text: "1 Team member access", available: true },
                                { text: "Automated skill gap analysis", available: false },
                                { text: "Advanced analytics & reporting", available: false },
                                { text: "Priority 24/7 support", available: false }
                            ]}
                            delay="delay-100"
                            onClick={() => handlePlanSelect({ title: 'Starter', price: 'Free' })}
                            buttonText={subscription?.plan_name === 'Starter' ? "Active Plan" : (isAuthenticated ? "Get Free Plan" : "Get Started")}
                            linkTo={null}
                        />
                        <PricingCard
                            title="Recruiter"
                            price="₹499"
                            description="Advanced capabilities for growing organizations scaling their talent pipeline."
                            features={[
                                { text: "Up to 500 resume screenings / mo", available: true },
                                { text: "Advanced AI semantic ranking", available: true },
                                { text: "Up to 5 Team members", available: true },
                                { text: "Automated skill gap analysis", available: true },
                                { text: "Advanced analytics & reporting", available: true },
                                { text: "Priority 24/7 support", available: false }
                            ]}
                            isPopular={true}
                            delay="delay-200"
                            onClick={() => handlePlanSelect({ title: 'Recruiter', price: '₹499' })}
                            buttonText={subscription?.plan_name === 'Recruiter' ? "Active Plan" : "Upgrade Now"}
                            linkTo={isAuthenticated ? null : "/signup"}
                        />
                        <PricingCard
                            title="Enterprise"
                            price="₹4,999"
                            description="Bespoke models and unlimited scale for enterprise talent acquisition teams."
                            features={[
                                { text: "Unlimited resume screenings / mo", available: true },
                                { text: "Custom AI models & ranking criteria", available: true },
                                { text: "Unlimited Team access", available: true },
                                { text: "Custom skill gap frameworks", available: true },
                                { text: "Custom BI reporting exports", available: true },
                                { text: "Dedicated Technical Account Manager", available: true }
                            ]}
                            delay="delay-300"
                            onClick={() => handlePlanSelect({ title: 'Enterprise', price: '₹4,999' })}
                            buttonText={subscription?.plan_name === 'Enterprise' ? "Active Plan" : (isAuthenticated ? "Upgrade Now" : "Get Enterprise Plan")}
                            linkTo={isAuthenticated ? null : "/signup"}
                        />
                    </div>
                </div>

                {selectedPlan && (
                    <PaymentModal 
                        plan={selectedPlan} 
                        isOpen={isPaymentModalOpen} 
                        onClose={() => setIsPaymentModalOpen(false)} 
                        onSuccess={() => {
                            console.log("Payment successful!");
                            // Optionally redirect to dashboard or show success message
                        }}
                    />
                )}
            </section>

            <section className="py-24 relative overflow-hidden bg-transparent section-fade">
                <div className="max-w-7xl mx-auto px-4 lg:px-8">
                    <div className="flex justify-center reveal-on-scroll">
                        <div className="p-px rounded-[3rem] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-2xl overflow-hidden group hover:scale-[1.02] transition-transform duration-500 w-full lg:w-auto">
                            <div className="bg-background/95 rounded-[2.9rem] px-12 py-16 lg:px-24 text-center max-w-4xl backdrop-blur-3xl relative">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-indigo-500/5 blur-3xl -z-10 animate-pulse-slow"></div>
                                <h4 className="text-3xl lg:text-5xl font-black text-foreground mb-6">Ready to scale your intelligence?</h4>
                                <p className="text-foreground-dim text-lg lg:text-xl mb-12 max-w-2xl mx-auto font-medium">Join forward-thinking companies leveraging neural screening to build elite teams at scale.</p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                    <Link to={ctaLink} className="w-full sm:w-auto px-12 py-5 premium-button rounded-2xl font-bold text-lg flex items-center justify-center gap-3 group">
                                        {isAuthenticated ? "Pro Dashboard" : "Start Your Free Trial"} <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform duration-300" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;
