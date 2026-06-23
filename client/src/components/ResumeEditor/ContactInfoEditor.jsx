import React from 'react';
import { User, Mail, Phone } from 'lucide-react';

/**
 * ContactInfoEditor Component
 * Scopes contact inputs (name, email, phone) separately.
 */
export default function ContactInfoEditor({ name, email, phone, onChange }) {
  return (
    <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 flex flex-col gap-4 shadow-2xl shadow-black/50">
      <h5 className="font-sans text-sm font-semibold text-violet-400 uppercase tracking-wider border-b border-white/5 pb-2">
        Contact Information
      </h5>
      
      {/* Name Input */}
      <div className="flex flex-col gap-1.5">
        <label className="font-sans font-medium text-xs text-slate-400 flex items-center gap-1.5">
          <User className="w-3 h-3 text-cyan-400" /> Full Name
        </label>
        <input 
          type="text" 
          className="bg-black/20 border border-white/5 rounded-lg px-4 py-2.5 text-slate-100 font-sans text-sm focus:outline-none focus:border-violet-500 transition-all duration-200"
          value={name || ''} 
          onChange={(e) => onChange('name', e.target.value)}
        />
      </div>

      {/* Email and Phone Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="font-sans font-medium text-xs text-slate-400 flex items-center gap-1.5">
            <Mail className="w-3 h-3 text-cyan-400" /> Email Address
          </label>
          <input 
            type="email" 
            className="bg-black/20 border border-white/5 rounded-lg px-4 py-2.5 text-slate-100 font-sans text-sm focus:outline-none focus:border-violet-500 transition-all duration-200"
            value={email || ''} 
            onChange={(e) => onChange('email', e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-sans font-medium text-xs text-slate-400 flex items-center gap-1.5">
            <Phone className="w-3 h-3 text-cyan-400" /> Phone Number
          </label>
          <input 
            type="text" 
            className="bg-black/20 border border-white/5 rounded-lg px-4 py-2.5 text-slate-100 font-sans text-sm focus:outline-none focus:border-violet-500 transition-all duration-200"
            value={phone || ''} 
            onChange={(e) => onChange('phone', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
