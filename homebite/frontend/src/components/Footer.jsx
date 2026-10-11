import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-100/60 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="space-y-3">
            <h3 className="font-display text-xl font-bold text-stone-900">HomeBite</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Empowering talented neighborhood home cooks and connecting food lovers to fresh, nourishing homestyle meals.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider mb-3">Marketplace</h4>
            <ul className="space-y-2 text-sm text-stone-600">
              <li><Link to="/dishes" className="hover:text-orange-600">Browse Menu</Link></li>
              <li><Link to="/cooks" className="hover:text-orange-600">Local Chefs & Cooks</Link></li>
              <li><Link to="/dishes?category=Italian" className="hover:text-orange-600">Handmade Italian</Link></li>
              <li><Link to="/dishes?category=Indian" className="hover:text-orange-600">Traditional Indian</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider mb-3">For Cooks</h4>
            <ul className="space-y-2 text-sm text-stone-600">
              <li><Link to="/register/cook" className="hover:text-orange-600">Open Your Home Kitchen</Link></li>
              <li><Link to="/cook/dashboard" className="hover:text-orange-600">Cook Studio Dashboard</Link></li>
              <li><span className="text-stone-400">Kitchen Hygiene Standards</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider mb-3">Technology Stack</h4>
            <div className="text-xs text-stone-600 space-y-1">
              <p>Frontend: React 18, Vite, React Router, Axios</p>
              <p>Backend: Java 21, Spring Boot 3, Spring Security</p>
              <p>Database: MySQL 8 (homebite)</p>
              <p className="pt-2 text-stone-500 font-medium">Academic Capstone Full-Stack Architecture</p>
            </div>
          </div>
        </div>

        <div className="border-t border-stone-200/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© 2026 HomeBite Social Marketplace. All rights reserved.</p>
          <div className="flex gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Food Safety Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
