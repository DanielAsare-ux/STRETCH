import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Crown, 
  Check, 
  Smartphone, 
  Shield, 
  Zap, 
  Star,
  ArrowRight,
  X,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Premium.css';

function Premium() {
  const { isPremium, premiumExpiresAt, upgradeToPremium, PREMIUM_PRICE, PREMIUM_FEATURES, user } = useAuth();
  const navigate = useNavigate();
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentStep, setPaymentStep] = useState('input'); // input, processing, success, error
  const [error, setError] = useState('');

  const handleStartPayment = () => {
    setShowPaymentModal(true);
    setPaymentStep('input');
    setError('');
    setPhoneNumber('');
  };

  const validatePhoneNumber = (number) => {
    // Ghana MTN numbers start with 024, 054, 055, 059
    const cleanNumber = number.replace(/\s/g, '');
    const mtnPrefixes = ['024', '054', '055', '059', '024', '233'];
    return cleanNumber.length >= 10 && mtnPrefixes.some(prefix => cleanNumber.startsWith(prefix));
  };

  const handlePayment = async () => {
    setError('');
    
    if (!phoneNumber) {
      setError('Please enter your MTN MoMo number');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid MTN mobile number');
      return;
    }

    setPaymentStep('processing');

    // Simulate payment processing (in real app, this would call MTN MoMo API)
    // For demo purposes, we simulate a successful payment after 3 seconds
    setTimeout(() => {
      const transactionId = `TXN${Date.now()}`;
      const result = upgradeToPremium(transactionId);
      
      if (result.success) {
        setPaymentStep('success');
      } else {
        setPaymentStep('error');
        setError('Payment failed. Please try again.');
      }
    }, 3000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isPremium) {
    return (
      <div className="premium-page">
        <div className="premium-active">
          <div className="premium-badge-large">
            <Crown size={48} />
          </div>
          <h1>You're a Premium Member! 👑</h1>
          <p className="premium-status">
            Your subscription is active until <strong>{formatDate(premiumExpiresAt)}</strong>
          </p>
          
          <div className="premium-features-active">
            <h3>Your Premium Benefits</h3>
            <div className="features-grid">
              {PREMIUM_FEATURES.map((feature, index) => (
                <div key={index} className="feature-item active">
                  <CheckCircle2 size={20} />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <button className="btn-secondary" onClick={() => navigate('/')}>
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="premium-page">
      <header className="premium-header">
        <div className="premium-badge">
          <Crown size={32} />
          <span>PREMIUM</span>
        </div>
        <h1>Unlock Your Full Potential</h1>
        <p>Get access to exclusive features and take your fitness to the next level</p>
      </header>

      <div className="pricing-card">
        <div className="price-tag">
          <span className="currency">GH₵</span>
          <span className="amount">{PREMIUM_PRICE}</span>
          <span className="period">/month</span>
        </div>
        <p className="price-subtitle">Billed monthly via MTN Mobile Money</p>
        
        <button className="btn-upgrade" onClick={handleStartPayment}>
          <Zap size={20} />
          Upgrade Now
          <ArrowRight size={20} />
        </button>

        <div className="payment-methods">
          <div className="mtn-badge">
            <Smartphone size={18} />
            <span>MTN Mobile Money</span>
          </div>
        </div>
      </div>

      <div className="features-section">
        <h2>Premium Features</h2>
        <div className="features-list">
          {PREMIUM_FEATURES.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">
                <Check size={24} />
              </div>
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="benefits-section">
        <div className="benefit-card">
          <Shield size={32} />
          <h3>Secure Payments</h3>
          <p>Your transactions are protected with industry-standard security</p>
        </div>
        <div className="benefit-card">
          <Star size={32} />
          <h3>Cancel Anytime</h3>
          <p>No long-term commitment. Cancel your subscription whenever you want</p>
        </div>
        <div className="benefit-card">
          <Zap size={32} />
          <h3>Instant Access</h3>
          <p>Get immediate access to all premium features after payment</p>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="payment-modal-overlay" onClick={() => paymentStep !== 'processing' && setShowPaymentModal(false)}>
          <div className="payment-modal" onClick={e => e.stopPropagation()}>
            {paymentStep === 'input' && (
              <>
                <button className="modal-close" onClick={() => setShowPaymentModal(false)}>
                  <X size={24} />
                </button>
                <div className="modal-header">
                  <div className="mtn-logo">
                    <Smartphone size={32} />
                    <span>MTN MoMo</span>
                  </div>
                  <h2>Complete Payment</h2>
                  <p>Pay GH₵{PREMIUM_PRICE} for 1 month of Premium</p>
                </div>

                <div className="modal-body">
                  {error && (
                    <div className="payment-error">
                      {error}
                    </div>
                  )}

                  <div className="form-group">
                    <label>MTN Mobile Money Number</label>
                    <div className="phone-input">
                      <span className="country-code">+233</span>
                      <input
                        type="tel"
                        placeholder="24 XXX XXXX"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        maxLength={12}
                      />
                    </div>
                    <p className="input-hint">Enter your MTN MoMo registered number</p>
                  </div>

                  <div className="payment-summary">
                    <div className="summary-row">
                      <span>Premium Subscription (1 month)</span>
                      <span>GH₵{PREMIUM_PRICE}.00</span>
                    </div>
                    <div className="summary-row total">
                      <span>Total</span>
                      <span>GH₵{PREMIUM_PRICE}.00</span>
                    </div>
                  </div>

                  <button className="btn-pay" onClick={handlePayment}>
                    <Smartphone size={20} />
                    Pay with MTN MoMo
                  </button>

                  <p className="payment-note">
                    You will receive a prompt on your phone to confirm the payment
                  </p>
                </div>
              </>
            )}

            {paymentStep === 'processing' && (
              <div className="payment-processing">
                <Loader2 size={48} className="spinner" />
                <h2>Processing Payment...</h2>
                <p>Please check your phone and enter your MTN MoMo PIN to complete the payment</p>
                <div className="processing-steps">
                  <div className="step active">
                    <Check size={16} />
                    <span>Payment initiated</span>
                  </div>
                  <div className="step pending">
                    <Loader2 size={16} className="spinner-small" />
                    <span>Waiting for confirmation</span>
                  </div>
                </div>
              </div>
            )}

            {paymentStep === 'success' && (
              <div className="payment-success">
                <div className="success-icon">
                  <CheckCircle2 size={64} />
                </div>
                <h2>Payment Successful! 🎉</h2>
                <p>Welcome to STRETCH Premium, {user?.name}!</p>
                <p className="success-details">
                  Your premium features are now unlocked
                </p>
                <button className="btn-continue" onClick={() => navigate('/')}>
                  Start Exploring
                  <ArrowRight size={20} />
                </button>
              </div>
            )}

            {paymentStep === 'error' && (
              <div className="payment-error-state">
                <div className="error-icon">
                  <X size={64} />
                </div>
                <h2>Payment Failed</h2>
                <p>{error || 'Something went wrong. Please try again.'}</p>
                <button className="btn-retry" onClick={() => setPaymentStep('input')}>
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Premium;
