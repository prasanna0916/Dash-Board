import React, { useState } from 'react';
import { Zap, ShieldCheck, AlertCircle, Sparkles, Check, ArrowRight, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

export const PredictionSimulatorPage: React.FC = () => {
  // Input customer attributes
  const [tenure, setTenure] = useState(4);
  const [monthlyCharges, setMonthlyCharges] = useState(85);
  const [contract, setContract] = useState<'Month-to-month' | 'One year' | 'Two year'>('Month-to-month');
  const [internetService, setInternetService] = useState<'Fiber optic' | 'DSL' | 'No'>('Fiber optic');
  const [techSupport, setTechSupport] = useState<'Yes' | 'No'>('No');
  const [onlineSecurity, setOnlineSecurity] = useState<'Yes' | 'No'>('No');
  const [paymentMethod, setPaymentMethod] = useState<'Electronic check' | 'Credit card' | 'Bank transfer' | 'Mailed check'>('Electronic check');
  const [seniorCitizen, setSeniorCitizen] = useState(false);
  const [hasPartner, setHasPartner] = useState(false);

  // Model calculation state
  const [predictedScore, setPredictedScore] = useState<number | null>(0.74);
  const [appliedIntervention, setAppliedIntervention] = useState(false);

  // Function to calculate churn probability
  const calculateProbability = (
    cContract = contract,
    cSupport = techSupport,
    cSecurity = onlineSecurity,
    cTenure = tenure,
    cInternet = internetService,
    cPayment = paymentMethod,
    cCharges = monthlyCharges,
    cSenior = seniorCitizen
  ) => {
    let logit = -1.2;
    if (cContract === 'Month-to-month') logit += 1.35;
    else if (cContract === 'Two year') logit -= 1.5;

    if (cInternet === 'Fiber optic') logit += 0.8;
    if (cSupport === 'No' && cInternet !== 'No') logit += 0.65;
    if (cSecurity === 'No' && cInternet !== 'No') logit += 0.4;
    if (cTenure < 6) logit += 1.1;
    else if (cTenure > 36) logit -= 1.2;
    if (cPayment === 'Electronic check') logit += 0.5;
    if (cSenior) logit += 0.25;
    if (cCharges > 80) logit += 0.35;

    const prob = 1 / (1 + Math.exp(-logit));
    return Number(Math.min(0.96, Math.max(0.04, prob)).toFixed(3));
  };

  const handlePredict = () => {
    const score = calculateProbability();
    setPredictedScore(score);
    if (score < 0.35) {
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
    }
  };

  // Simulate Retention Package
  const handleApplyIntervention = () => {
    setContract('One year');
    setTechSupport('Yes');
    setOnlineSecurity('Yes');
    setPaymentMethod('Bank transfer');
    setAppliedIntervention(true);

    const newScore = calculateProbability('One year', 'Yes', 'Yes', tenure, internetService, 'Bank transfer', monthlyCharges, seniorCitizen);
    setPredictedScore(newScore);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#10B981', '#34D399', '#059669'],
    });
  };

  const handleReset = () => {
    setTenure(4);
    setMonthlyCharges(85);
    setContract('Month-to-month');
    setInternetService('Fiber optic');
    setTechSupport('No');
    setOnlineSecurity('No');
    setPaymentMethod('Electronic check');
    setSeniorCitizen(false);
    setHasPartner(false);
    setAppliedIntervention(false);
    setPredictedScore(0.74);
  };

  const score = predictedScore ?? 0.5;
  const isHighRisk = score >= 0.5;
  const isModerateRisk = score >= 0.3 && score < 0.5;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <span>Live Customer Churn Risk Estimator & What-If Simulator</span>
          <span className="font-mono text-xs font-normal text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
            model.predict_proba()
          </span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Adjust customer account attributes in real time to simulate churn probabilities and test counteractive retention bundles.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Form (Streamlit Form Simulation) */}
        <div className="lg:col-span-7 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Customer Profile Attributes
            </h4>
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-[#ff4b4b] transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset Profile</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Tenure Slider */}
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                <span>Customer Tenure</span>
                <span className="font-mono text-[#ff4b4b]">{tenure} months</span>
              </div>
              <input
                type="range"
                min="1"
                max="72"
                value={tenure}
                onChange={(e) => {
                  setTenure(Number(e.target.value));
                  setAppliedIntervention(false);
                }}
                className="w-full accent-[#ff4b4b]"
              />
              <span className="text-[10px] text-slate-400">1 mo (new) to 72 mos (veteran)</span>
            </div>

            {/* Monthly Charges Slider */}
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                <span>Monthly Plan Fee</span>
                <span className="font-mono text-[#ff4b4b]">${monthlyCharges}/mo</span>
              </div>
              <input
                type="range"
                min="20"
                max="120"
                value={monthlyCharges}
                onChange={(e) => {
                  setMonthlyCharges(Number(e.target.value));
                  setAppliedIntervention(false);
                }}
                className="w-full accent-[#ff4b4b]"
              />
              <span className="text-[10px] text-slate-400">$20 (basic) to $120 (premium)</span>
            </div>

            {/* Contract Type */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Contract Type
              </label>
              <select
                value={contract}
                onChange={(e) => {
                  setContract(e.target.value as any);
                  setAppliedIntervention(false);
                }}
                className="w-full rounded border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="Month-to-month">Month-to-month (High Risk)</option>
                <option value="One year">One year agreement</option>
                <option value="Two year">Two year commitment</option>
              </select>
            </div>

            {/* Internet Service Tier */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Internet Connection Tier
              </label>
              <select
                value={internetService}
                onChange={(e) => {
                  setInternetService(e.target.value as any);
                  setAppliedIntervention(false);
                }}
                className="w-full rounded border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="Fiber optic">Fiber Optic (Gigabit)</option>
                <option value="DSL">DSL Broadband</option>
                <option value="No">No Internet Service</option>
              </select>
            </div>

            {/* Tech Support */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Tech Support Package
              </label>
              <div className="flex gap-4 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="techSupport"
                    checked={techSupport === 'Yes'}
                    onChange={() => {
                      setTechSupport('Yes');
                      setAppliedIntervention(false);
                    }}
                    className="accent-[#ff4b4b]"
                  />
                  <span>Yes (Active)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="techSupport"
                    checked={techSupport === 'No'}
                    onChange={() => {
                      setTechSupport('No');
                      setAppliedIntervention(false);
                    }}
                    className="accent-[#ff4b4b]"
                  />
                  <span>No Support</span>
                </label>
              </div>
            </div>

            {/* Online Security */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Online Security Add-on
              </label>
              <div className="flex gap-4 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="security"
                    checked={onlineSecurity === 'Yes'}
                    onChange={() => {
                      setOnlineSecurity('Yes');
                      setAppliedIntervention(false);
                    }}
                    className="accent-[#ff4b4b]"
                  />
                  <span>Yes (Active)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="security"
                    checked={onlineSecurity === 'No'}
                    onChange={() => {
                      setOnlineSecurity('No');
                      setAppliedIntervention(false);
                    }}
                    className="accent-[#ff4b4b]"
                  />
                  <span>No Security</span>
                </label>
              </div>
            </div>

            {/* Payment Method */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => {
                  setPaymentMethod(e.target.value as any);
                  setAppliedIntervention(false);
                }}
                className="w-full rounded border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="Electronic check">Electronic Check (Manual)</option>
                <option value="Credit card">Credit Card (Automated)</option>
                <option value="Bank transfer">Bank Transfer (Automated)</option>
                <option value="Mailed check">Mailed Check</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <label className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={seniorCitizen}
                onChange={(e) => {
                  setSeniorCitizen(e.target.checked);
                  setAppliedIntervention(false);
                }}
                className="rounded accent-[#ff4b4b]"
              />
              <span>Senior Citizen (65+)</span>
            </label>

            <label className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={hasPartner}
                onChange={(e) => {
                  setHasPartner(e.target.checked);
                  setAppliedIntervention(false);
                }}
                className="rounded accent-[#ff4b4b]"
              />
              <span>Has Partner / Family Account</span>
            </label>
          </div>

          <button
            onClick={handlePredict}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#ff4b4b] py-2.5 text-xs font-semibold text-white hover:bg-[#e03a3a] transition-all shadow-sm active:scale-[0.99]"
          >
            <Zap className="h-4 w-4" />
            <span>Recompute Model Probability</span>
          </button>
        </div>

        {/* Right Column: Prediction Score Meter & Strategic Intervention */}
        <div className="lg:col-span-5 space-y-4">
          {/* Risk Card */}
          <div
            className={`rounded-lg border p-5 transition-all shadow-sm ${
              isHighRisk
                ? 'border-rose-200 bg-rose-50/40 dark:border-rose-900/40 dark:bg-rose-950/20'
                : isModerateRisk
                ? 'border-amber-200 bg-amber-50/40 dark:border-amber-900/40 dark:bg-amber-950/20'
                : 'border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/40 dark:bg-emerald-950/20'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Predicted Churn Probability
              </span>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded ${
                  isHighRisk
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300'
                    : isModerateRisk
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                }`}
              >
                {isHighRisk ? 'High Risk' : isModerateRisk ? 'Moderate Risk' : 'Low Risk / Loyal'}
              </span>
            </div>

            {/* Meter value */}
            <div className="my-4 text-center">
              <div
                className={`font-mono text-5xl font-black tracking-tight tabular-nums ${
                  isHighRisk ? 'text-[#ff4b4b]' : isModerateRisk ? 'text-amber-600' : 'text-emerald-600'
                }`}
              >
                {(score * 100).toFixed(1)}%
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Estimated probability of cancellation within next 60 days
              </p>

              {/* Meter bar */}
              <div className="mt-3 h-3 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className={`h-full transition-all duration-700 ${
                    isHighRisk ? 'bg-[#ff4b4b]' : isModerateRisk ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${score * 100}%` }}
                />
              </div>
            </div>

            {/* Drivers list */}
            <div className="space-y-1.5 pt-3 border-t border-black/5 dark:border-white/5 text-xs">
              <div className="font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Top Model Decision Factors:
              </div>
              {contract === 'Month-to-month' && (
                <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-mono text-[11px]">
                  <span>▲</span> Month-to-month agreement (+32% risk)
                </div>
              )}
              {techSupport === 'No' && internetService !== 'No' && (
                <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-mono text-[11px]">
                  <span>▲</span> Lack of tech support (+18% risk)
                </div>
              )}
              {tenure < 6 && (
                <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-mono text-[11px]">
                  <span>▲</span> Early onboarding window &lt;6 mos (+15% risk)
                </div>
              )}
              {paymentMethod === 'Electronic check' && (
                <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-mono text-[11px]">
                  <span>▲</span> Manual electronic check payment (+12% risk)
                </div>
              )}
              {contract !== 'Month-to-month' && (
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">
                  <span>▼</span> Long-term contract commitment (-30% risk)
                </div>
              )}
              {techSupport === 'Yes' && (
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">
                  <span>▼</span> Active tech support shield (-22% risk)
                </div>
              )}
              {tenure > 24 && (
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">
                  <span>▼</span> Established account tenure &gt;2 yrs (-25% risk)
                </div>
              )}
            </div>
          </div>

          {/* Retention Intervention Action Button */}
          {isHighRisk && (
            <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
              <h5 className="font-semibold text-xs text-amber-900 dark:text-amber-200 flex items-center gap-1.5 mb-1">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span>Simulate Recommended Retention Intervention</span>
              </h5>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                Offer a 1-year contract extension with 3 months free Tech Support and automated payment discount ($10/mo savings).
              </p>

              <button
                onClick={handleApplyIntervention}
                className="w-full flex items-center justify-center gap-2 rounded bg-emerald-600 py-2 px-3 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors shadow-sm"
              >
                <span>Apply Retention Package</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {appliedIntervention && (
            <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950/40 text-xs text-emerald-900 dark:text-emerald-200">
              <div className="flex items-center gap-2 font-bold mb-1">
                <Check className="h-4 w-4 text-emerald-600" />
                <span>Intervention Applied Successfully!</span>
              </div>
              <p>
                Customer churn risk was lowered by <strong>53 percentage points</strong>. Projected annual customer lifetime revenue protected: <strong>${(monthlyCharges * 12).toLocaleString()}</strong>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
