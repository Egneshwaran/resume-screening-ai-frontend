import React, { useState } from 'react';
import { Shield, CheckCircle, Loader2, Sparkles, CreditCard, Lock } from 'lucide-react';
import PaymentService from '../services/payment.service';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/useAuth';

const PaymentModal = ({ plan, isOpen, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState('summary'); // 'summary' | 'processing' | 'success'
    const { user, token, refreshSubscription } = useAuth();

    if (!isOpen) return null;

    const handlePayment = async () => {
        console.log("Starting payment process for plan:", plan.title);
        setLoading(true);
        setStep('processing');

        try {
            const isFree = plan.price.toLowerCase() === 'free';

            if (isFree) {
                const { error: subError } = await supabase
                    .from('subscriptions')
                    .upsert({
                        email: user.email,
                        plan_name: plan.title,
                        status: 'ACTIVE',
                        resume_limit: 50,
                        start_date: new Date().toISOString(),
                        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
                    });

                if (subError) throw subError;

                refreshSubscription();
                setStep('success');
                setTimeout(() => {
                    onSuccess();
                    onClose();
                }, 2000);
                return;
            }

            const amount = parseInt(plan.price.replace(/[^0-9]/g, '')) || 0;
            const orderData = await PaymentService.createOrder(
                amount, 
                plan.title, 
                user?.email, 
                user?.profile?.name || user?.email?.split('@')[0], 
                user?.profile?.company_name || "",
                token
            );

            const options = {
                key: orderData.keyId,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "RecruitAI",
                description: `Upgrade to ${plan.title} Plan`,
                order_id: orderData.id,
                handler: async function (response) {
                    console.log("Razorpay payment response received:", response);
                    try {
                        const verification = await PaymentService.verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        }, plan.title, user.email, token);

                        if (verification.status === 'success') {
                            await supabase.from('subscriptions').upsert({
                                email: user.email,
                                plan_name: plan.title,
                                status: 'ACTIVE',
                                resume_limit: plan.title === 'Starter' ? 50 : plan.title === 'Recruiter' ? 500 : 999999,
                                start_date: new Date().toISOString(),
                                end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
                            });

                            await supabase.from('payments').insert([{
                                email: user.email,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                amount: amount,
                                status: 'SUCCESS'
                            }]);

                            refreshSubscription();
                            setStep('success');

                            setTimeout(() => {
                                onSuccess();
                                onClose();
                            }, 3500);
                        } else {
                            alert("Payment verification failed");
                            setStep('summary');
                            setLoading(false);
                        }
                    } catch (err) {
                        console.error("Payment update failed:", err);
                        alert("Error: " + err.message);
                        setStep('summary');
                        setLoading(false);
                    }
                },
                prefill: {
                    name: user?.fullName || "",
                    email: user?.email || "",
                },
                notes: {
                    plan: plan.title
                },
                theme: {
                    color: "#6366f1"
                }
            };

            if (!window.Razorpay) {
                alert("Razorpay SDK failed to load.");
                setStep('summary');
                setLoading(false);
                return;
            }

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                console.error(response.error);
                alert("Payment failed: " + response.error.description);
                setStep('summary');
            });
            rzp.open();
            setLoading(false);

        } catch (error) {
            console.error("Order creation failed", error);
            alert("Something went wrong. Please try again.");
            setLoading(false);
            setStep('summary');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-card border border-border w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-indigo-500/10 to-transparent -z-10"></div>
                <div className="p-8">
                    {step === 'summary' && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 mx-auto mb-4 border border-indigo-500/20">
                                    <Sparkles size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-foreground">Upgrade Plan</h3>
                                <p className="text-foreground-muted">Experience the full power of RecruitAI</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-foreground-muted font-medium">Selected Plan</span>
                                    <span className="text-indigo-500 font-bold px-3 py-1 bg-indigo-500/10 rounded-full text-sm uppercase tracking-wider">{plan.title}</span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-3xl font-black text-foreground">{plan.price}</p>
                                        <p className="text-xs text-foreground-muted">Includes all {plan.title} features</p>
                                    </div>
                                    <CheckCircle className="text-indigo-500 w-8 h-8 opacity-50" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm text-foreground-muted">
                                    <Shield size={16} className="text-emerald-500" />
                                    <span>Secure 256-bit encrypted payment</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-foreground-muted">
                                    <Lock size={16} className="text-emerald-500" />
                                    <span>SSL Encrypted Connection</span>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={onClose} className="flex-1 py-4 px-6 rounded-2xl font-bold text-foreground border border-border hover:bg-foreground/5 transition-all">Cancel</button>
                                <button onClick={handlePayment} disabled={loading} className="flex-[2] py-4 px-6 rounded-2xl font-bold text-white premium-button shadow-indigo-500/20 hover:shadow-indigo-500/40 flex items-center justify-center gap-2">
                                    {loading ? <Loader2 className="animate-spin" /> : (plan.price.toLowerCase() === 'free' ? <CheckCircle size={20} /> : <CreditCard size={20} />)}
                                    {plan.price.toLowerCase() === 'free' ? 'Activate Now' : 'Pay Now'}
                                </button>
                            </div>
                        </div>
                    )}
                    {step === 'processing' && !loading && (
                        <div className="py-12 text-center space-y-6">
                            <div className="relative w-24 h-24 mx-auto">
                                <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center text-indigo-500"><CreditCard size={32} /></div>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-foreground">Waiting for Payment</h3>
                                <p className="text-foreground-muted max-w-xs mx-auto mt-2">Please complete the transaction in the secure Razorpay window.</p>
                            </div>
                        </div>
                    )}
                    {step === 'success' && (
                        <div className="py-12 text-center space-y-6 animate-in zoom-in-95 duration-500">
                            <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mx-auto border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                                <CheckCircle size={48} className="animate-in zoom-in-50 duration-500" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-foreground">Payment Successful!</h3>
                                <p className="text-foreground-muted mt-2">Welcome to the elite tier. Your account has been upgraded.</p>
                            </div>
                            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-3 justify-center">
                                <Sparkles className="text-amber-500" size={20} /><span className="text-emerald-500 font-bold uppercase tracking-widest text-xs">Plan Activated</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
