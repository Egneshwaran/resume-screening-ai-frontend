import { supabase } from '../lib/supabase';

class PaymentService {
    async createOrder(amount, planName, email, fullName, company, token) {
        try {
            console.log("PaymentService: Creating order via Supabase Edge Function...", { amount, planName });
            
            const { data, error } = await supabase.functions.invoke('handle-payment', {
                body: {
                    action: 'create-order',
                    amount,
                    planName,
                    email,
                    name: fullName,
                    company
                }
            });

            if (error) {
                console.error("PaymentService: Create order error from SDK:", error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error("PaymentService: Create order fatal error:", error);
            throw error;
        }
    }

    async verifyPayment(paymentData, planName, email, token) {
        try {
            console.log("PaymentService: Verifying payment via Supabase Edge Function...", { planName, email });
            
            const { data, error } = await supabase.functions.invoke('handle-payment', {
                body: {
                    action: 'verify',
                    ...paymentData,
                    planName,
                    email
                }
            });

            if (error) {
                console.error("PaymentService: Verification error from SDK:", error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error("PaymentService: Verification fatal error:", error);
            throw error;
        }
    }

    async getActiveSubscription(email) {
        try {
            console.log("PaymentService: Fetching active subscription via Supabase DB...", email);
            const { data, error } = await supabase
                .from('subscriptions')
                .select('*')
                .eq('email', email)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error("Error fetching subscription:", error);
                throw error;
            }
            return data;
        } catch (error) {
            console.error("PaymentService: Get subscription error:", error);
            return null;
        }
    }
}

export default new PaymentService();
