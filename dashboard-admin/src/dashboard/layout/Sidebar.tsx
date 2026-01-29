import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import FontelloIcon from '../../shared/components/icons/FontelloIcon'
import { cn } from '../utils/cn'
import { useAuth } from '../../user/contexts'

// Función helper para obtener el SVG fallback apropiado según el icono
const getIconFallback = (iconName: string) => {
  const iconMap: Record<string, JSX.Element> = {
    'icon-home': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    'icon-chart-bar': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    'icon-chart-line': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    'icon-book': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    'icon-folder': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
    'icon-picture': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    'icon-doc-text': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    'icon-tag': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
    'icon-users': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    'icon-user-plus': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
    ),
    'icon-user': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    'icon-certificate': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    'icon-basket': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    'icon-credit-card': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    'icon-percent': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    'icon-shopping-cart': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    'icon-megaphone': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      </svg>
    ),
    'icon-gift': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
    ),
    'icon-mail': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    'icon-star': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    'icon-calendar': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    'icon-user-circle': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    'icon-repeat': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    'icon-cog': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    'icon-bell': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
    'icon-shield': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    'icon-facebook': (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    'icon-twitter': (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
      </svg>
    ),
    'icon-instagram': (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
    'icon-linkedin': (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    'icon-youtube': (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    'icon-lock': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    'icon-key': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
      </svg>
    ),
    'icon-database': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
      </svg>
    ),
    'icon-code': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    'icon-cloud': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
    'icon-file-text': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    'icon-help': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    'icon-book-open': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    'icon-globe': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    'icon-palette': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    'icon-history': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    'icon-server': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
      </svg>
    ),
    'icon-plug': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    'icon-map': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5-2V4l5 2 6-2 5 2v14l-5-2-6 2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 6v14M15 4v14" />
      </svg>
    ),
    'icon-activity': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M22 12h-4l-3 7-6-14-3 7H2" />
      </svg>
    ),
    'icon-clock': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    'icon-check': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    'icon-flask': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 2v6l-4 8a4 4 0 003.5 6h5a4 4 0 003.5-6l-4-8V2" />
      </svg>
    ),
    'icon-logout': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
    ),
    'icon-eye': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    'icon-eye-off': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0L7.05 7.05m-1.76 1.76L3 3m3.29 3.29l3.29 3.29" />
      </svg>
    ),
    'icon-attention': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  }

  return iconMap[iconName] || (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
}

interface MenuSection {
  title: string
  items: MenuItem[]
}

interface MenuItem {
  icon: string
  label: string
  path: string
  badge?: string
}

const menuSections: MenuSection[] = [
  // ========== SECCIÓN PRINCIPAL ==========
  {
    title: 'Principal',
    items: [
      { icon: 'icon-home', label: 'Dashboard', path: '/' },
      { icon: 'icon-chart-bar', label: 'Analytics', path: '/analytics' },
    ]
  },
  
  // ========== GESTIÓN DE CONTENIDO ==========
  {
    title: 'Gestión de Contenido',
    items: [
      { icon: 'icon-book', label: 'Cursos', path: '/courses' },
      { icon: 'icon-code', label: 'Headers de Cursos', path: '/courses/headers' },
      { icon: 'icon-folder', label: 'Categorías', path: '/courses/categories' },
      { icon: 'icon-briefcase', label: 'Tipos de Carrera', path: '/courses/career-types' },
      { icon: 'icon-folder', label: 'Secciones', path: '/sections' },
      { icon: 'icon-picture', label: 'Secciones Hero', path: '/header-section' },
      { icon: 'icon-doc-text', label: 'Contenidos', path: '/contents' },
      { icon: 'icon-tag', label: 'Categorías', path: '/categories' },
    ]
  },
  {
    title: 'Contenido Dinámico',
    items: [
      { icon: 'icon-megaphone', label: 'Banners & Anuncios', path: '/dynamic/banners' },
      { icon: 'icon-doc-text', label: 'Popups & Modales', path: '/dynamic/popups' },
      { icon: 'icon-tag', label: 'Segmentación de Contenido', path: '/dynamic/segments' },
    ]
  },
  
  // ========== USUARIOS Y PERMISOS ==========
  {
    title: 'Estudiantes',
    items: [
      { icon: 'icon-users', label: 'Todos los Estudiantes', path: '/students' },
      { icon: 'icon-user-plus', label: 'Nuevos Estudiantes', path: '/students?filter=new' },
      { icon: 'icon-user', label: 'Estudiantes Activos', path: '/students?filter=active' },
      { icon: 'icon-certificate', label: 'Certificados', path: '/certificates' },
    ]
  },
  {
    title: 'Roles & Permisos',
    items: [
      { icon: 'icon-user-circle', label: 'Gestión de Roles', path: '/roles' },
      { icon: 'icon-shield', label: 'Permisos', path: '/roles/permissions' },
      { icon: 'icon-users', label: 'Asignar Roles', path: '/roles/assign' },
      { icon: 'icon-user', label: 'Roles por Usuario', path: '/roles/user-roles' },
      { icon: 'icon-cog', label: 'Configuración de Roles', path: '/roles/settings' },
      { icon: 'icon-history', label: 'Historial de Cambios', path: '/roles/history' },
    ]
  },
  {
    title: 'Equipo & Colaboración',
    items: [
      { icon: 'icon-users', label: 'Miembros del Equipo', path: '/team/members' },
      { icon: 'icon-mail', label: 'Mensajes Internos', path: '/team/messages' },
      { icon: 'icon-calendar', label: 'Calendario de Lanzamientos', path: '/team/releases' },
    ]
  },
  
  // ========== VENTAS Y MONETIZACIÓN ==========
  {
    title: 'Ventas y Pagos',
    items: [
      { icon: 'icon-basket', label: 'Órdenes', path: '/orders' },
      { icon: 'icon-credit-card', label: 'Pagos', path: '/payments' },
      { icon: 'icon-percent', label: 'Descuentos', path: '/courses/discount-events' },
      { icon: 'icon-shopping-cart', label: 'Carritos', path: '/carts' },
      { icon: 'icon-chart-line', label: 'Reportes de Ventas', path: '/sales-reports' },
    ]
  },
  {
    title: 'Suscripciones',
    items: [
      { icon: 'icon-calendar', label: 'Planes', path: '/subscriptions/plans' },
      { icon: 'icon-user-circle', label: 'Suscriptores', path: '/subscriptions/subscribers' },
      { icon: 'icon-repeat', label: 'Pagos Recurrentes', path: '/subscriptions/payments' },
    ]
  },
  {
    title: 'Marketing',
    items: [
      { icon: 'icon-megaphone', label: 'Campañas', path: '/campaigns' },
      { icon: 'icon-gift', label: 'Promociones', path: '/promotions' },
      { icon: 'icon-mail', label: 'Newsletters', path: '/newsletters' },
      { icon: 'icon-star', label: 'Reseñas', path: '/reviews' },
    ]
  },
  {
    title: 'Redes Sociales',
    items: [
      { icon: 'icon-facebook', label: 'Facebook', path: '/social/facebook' },
      { icon: 'icon-twitter', label: 'Twitter', path: '/social/twitter' },
      { icon: 'icon-instagram', label: 'Instagram', path: '/social/instagram' },
      { icon: 'icon-linkedin', label: 'LinkedIn', path: '/social/linkedin' },
      { icon: 'icon-youtube', label: 'YouTube', path: '/social/youtube' },
      { icon: 'icon-megaphone', label: 'Gestión de Publicaciones', path: '/social/posts' },
    ]
  },
  
  // ========== ANÁLISIS E INTELIGENCIA ==========
  {
    title: 'Data & Insights',
    items: [
      { icon: 'icon-chart-bar', label: 'Panel de Insights', path: '/insights/overview' },
      { icon: 'icon-database', label: 'Explorador de Datos', path: '/insights/explorer' },
      { icon: 'icon-file-text', label: 'Exportes Programados', path: '/insights/exports' },
    ]
  },
  {
    title: 'Inteligencia & Aprendizaje',
    items: [
      { icon: 'icon-chart-line', label: 'Análisis de Patrones', path: '/ai/patterns' },
      { icon: 'icon-star', label: 'Recomendaciones Inteligentes', path: '/ai/recommendations' },
      { icon: 'icon-activity', label: 'Predicciones de Comportamiento', path: '/ai/predictions' },
      { icon: 'icon-help', label: 'Feedback Loop', path: '/ai/feedback' },
      { icon: 'icon-repeat', label: 'Optimización Automática', path: '/ai/optimization' },
      { icon: 'icon-chart-bar', label: 'Insights Generados', path: '/ai/insights' },
    ]
  },
  {
    title: 'Experiencia de Usuario',
    items: [
      { icon: 'icon-activity', label: 'Embudo de Onboarding', path: '/ux/onboarding' },
      { icon: 'icon-star', label: 'NPS & Satisfacción', path: '/ux/nps' },
      { icon: 'icon-help', label: 'Puntos de Fricción', path: '/ux/friction' },
    ]
  },
  
  // ========== SEGURIDAD Y AUDITORÍA ==========
  {
    title: 'Seguridad',
    items: [
      { icon: 'icon-shield', label: 'Seguridad General', path: '/security' },
      { icon: 'icon-lock', label: 'Autenticación', path: '/security/authentication' },
      { icon: 'icon-key', label: 'API Keys', path: '/security/api-keys' },
      { icon: 'icon-user-circle', label: 'Permisos y Roles', path: '/security/permissions' },
      { icon: 'icon-history', label: 'Logs de Auditoría', path: '/security/audit-logs' },
      { icon: 'icon-bell', label: 'Alertas de Seguridad', path: '/security/alerts' },
    ]
  },
  {
    title: 'Logs & Auditoría',
    items: [
      { icon: 'icon-file-text', label: 'Logs de Aplicación', path: '/logs/app' },
      { icon: 'icon-history', label: 'Historial de Accesos', path: '/logs/access' },
      { icon: 'icon-shield', label: 'Eventos de Seguridad', path: '/logs/security' },
    ]
  },
  
  // ========== SISTEMA Y MONITOREO ==========
  {
    title: 'Sistema',
    items: [
      { icon: 'icon-database', label: 'Base de Datos', path: '/system/database' },
      { icon: 'icon-server', label: 'Servidores', path: '/system/servers' },
      { icon: 'icon-cloud', label: 'Backup y Restauración', path: '/system/backup' },
      { icon: 'icon-history', label: 'Logs del Sistema', path: '/system/logs' },
      { icon: 'icon-chart-line', label: 'Rendimiento', path: '/system/performance' },
      { icon: 'icon-bell', label: 'Monitoreo', path: '/system/monitoring' },
    ]
  },
  {
    title: 'Monitoreo Avanzado',
    items: [
      { icon: 'icon-activity', label: 'Tiempo Real', path: '/monitoring/realtime' },
      { icon: 'icon-map', label: 'Mapa de Usuarios', path: '/monitoring/user-map' },
      { icon: 'icon-map', label: 'Mapa de Calor', path: '/monitoring/heatmap' },
      { icon: 'icon-file-text', label: 'Logs de Errores', path: '/monitoring/error-logs' },
      { icon: 'icon-history', label: 'Registro de Actividad', path: '/monitoring/activity-log' },
    ]
  },
  {
    title: 'Mapas & Geo',
    items: [
      { icon: 'icon-map', label: 'Mapa de Sesiones', path: '/geo/sessions' },
      { icon: 'icon-map', label: 'Zonas de Mayor Tráfico', path: '/geo/zones' },
      { icon: 'icon-globe', label: 'Distribución por País', path: '/geo/countries' },
    ]
  },
  
  // ========== INTEGRACIONES Y DESARROLLO ==========
  {
    title: 'Integraciones',
    items: [
      { icon: 'icon-plug', label: 'API y Webhooks', path: '/integrations/api' },
      { icon: 'icon-code', label: 'Desarrolladores', path: '/integrations/developers' },
      { icon: 'icon-server', label: 'Servicios Externos', path: '/integrations/external' },
      { icon: 'icon-cloud', label: 'Almacenamiento', path: '/integrations/storage' },
      { icon: 'icon-mail', label: 'Email Services', path: '/integrations/email' },
      { icon: 'icon-credit-card', label: 'Pasarelas de Pago', path: '/integrations/payment-gateways' },
    ]
  },
  {
    title: 'Desarrolladores',
    items: [
      { icon: 'icon-code', label: 'Documentación API', path: '/developers/api-docs' },
      { icon: 'icon-plug', label: 'Playground API', path: '/developers/playground' },
      { icon: 'icon-server', label: 'Webhooks', path: '/developers/webhooks' },
      { icon: 'icon-key', label: 'API Keys', path: '/developers/api-keys' },
      { icon: 'icon-code', label: 'SDKs & Librerías', path: '/developers/sdks' },
      { icon: 'icon-file-text', label: 'Guías de Integración', path: '/developers/integration-guides' },
      { icon: 'icon-help', label: 'Sandbox & Testing', path: '/developers/sandbox' },
    ]
  },
  
  // ========== AUTOMATIZACIÓN Y PRODUCTO ==========
  {
    title: 'Automatizaciones',
    items: [
      { icon: 'icon-repeat', label: 'Flujos de Email', path: '/automation/email-flows' },
      { icon: 'icon-clock', label: 'Recordatorios', path: '/automation/reminders' },
      { icon: 'icon-plug', label: 'Disparadores', path: '/automation/triggers' },
    ]
  },
  {
    title: 'Producto & Experimentos',
    items: [
      { icon: 'icon-star', label: 'A/B Testing', path: '/product/experiments' },
      { icon: 'icon-chart-line', label: 'Embudo de Conversión', path: '/product/funnel' },
      { icon: 'icon-globe', label: 'Mapa del Sitio', path: '/product/sitemap' },
      { icon: 'icon-server', label: 'Estado de Servicios', path: '/product/status' },
      { icon: 'icon-repeat', label: 'Jobs en Cola', path: '/product/jobs' },
    ]
  },
  
  // ========== CALIDAD Y LEGAL ==========
  {
    title: 'Calidad & QA',
    items: [
      { icon: 'icon-check', label: 'Checklist de Lanzamiento', path: '/qa/checklists' },
      { icon: 'icon-file-text', label: 'Casos de Prueba', path: '/qa/test-cases' },
      { icon: 'icon-history', label: 'Regresión', path: '/qa/regression' },
    ]
  },
  {
    title: 'Regulación & Legal',
    items: [
      { icon: 'icon-file-text', label: 'Políticas', path: '/legal/policies' },
      { icon: 'icon-lock', label: 'Privacidad & Datos', path: '/legal/privacy' },
      { icon: 'icon-globe', label: 'Regiones & Normativas', path: '/legal/regions' },
    ]
  },
  
  // ========== CONFIGURACIÓN Y PERSONALIZACIÓN ==========
  {
    title: 'Personalización',
    items: [
      { icon: 'icon-palette', label: 'Temas y Estilos', path: '/customization/themes' },
      { icon: 'icon-picture', label: 'Branding', path: '/customization/branding' },
      { icon: 'icon-globe', label: 'Idiomas', path: '/customization/languages' },
      { icon: 'icon-cog', label: 'Configuración UI', path: '/customization/ui' },
      { icon: 'icon-mail', label: 'Plantillas de Email', path: '/customization/email-templates' },
    ]
  },
  {
    title: 'Configuración',
    items: [
      { icon: 'icon-cog', label: 'General', path: '/settings' },
      { icon: 'icon-user', label: 'Usuarios y Roles', path: '/settings/users' },
      { icon: 'icon-credit-card', label: 'Métodos de Pago', path: '/settings/payments' },
      { icon: 'icon-bell', label: 'Notificaciones', path: '/settings/notifications' },
      { icon: 'icon-shield', label: 'Seguridad', path: '/settings/security' },
      { icon: 'icon-globe', label: 'Regional', path: '/settings/regional' },
    ]
  },
  
  // ========== SOPORTE Y LABORATORIO ==========
  {
    title: 'Soporte y Ayuda',
    items: [
      { icon: 'icon-help', label: 'Centro de Ayuda', path: '/support/help' },
      { icon: 'icon-book-open', label: 'Documentación', path: '/support/documentation' },
      { icon: 'icon-mail', label: 'Contacto', path: '/support/contact' },
      { icon: 'icon-star', label: 'Feedback', path: '/support/feedback' },
      { icon: 'icon-file-text', label: 'Tickets de Soporte', path: '/support/tickets' },
    ]
  },
  {
    title: 'Laboratorio (Labs)',
    items: [
      { icon: 'icon-code', label: 'Prototipos', path: '/labs/prototypes' },
      { icon: 'icon-flask', label: 'Experimentos Beta', path: '/labs/beta' },
      { icon: 'icon-help', label: 'Ideas & Backlog', path: '/labs/ideas' },
    ]
  },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  onToggle?: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onToggle }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['Principal', 'Gestión de Contenido'])
  )
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024)

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Error durante el logout:', error)
      navigate('/login')
    }
  }

  const toggleSection = (title: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(title)) {
        newSet.delete(title)
      } else {
        newSet.add(title)
      }
      return newSet
    })
  }

  return (
    <>
      {/* Overlay para móvil */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/30 z-40 lg:hidden backdrop-blur-sm"
            />
          </>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isOpen ? 280 : (isDesktop ? 48 : 0),
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700',
          'flex flex-col h-full transition-colors overflow-hidden'
        )}
      >
        {/* Header cuando está cerrado (solo desktop) - Logo + Botón */}
        {!isOpen && isDesktop && (
          <div className="hidden lg:flex flex-col items-center py-4 border-b border-gray-200 dark:border-gray-700">
            <motion.img
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              src="https://i.ibb.co/dQ09SsH/logoDev2.png"
              alt="Logo"
              className="h-8 w-auto object-contain mb-3"
            />
            {onToggle && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onToggle}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Expandir menú"
              >
                <FontelloIcon
                  name="icon-right"
                  className="text-lg"
                  fallback={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  }
                />
              </motion.button>
            )}
          </div>
        )}

        {/* Contenido del sidebar */}
        <div 
          className={cn(
            'flex flex-col h-full transition-opacity',
            isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none lg:pointer-events-auto'
          )}
        >
          {/* Header del Sidebar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors">
            <div className="flex items-center flex-1">
              {isOpen && (
                <motion.img
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  src="https://i.ibb.co/dQ09SsH/logoDev2.png"
                  alt="Logo"
                  className="h-10 w-auto object-contain"
                />
              )}
            </div>
            <div className="flex items-center gap-2">
              {onToggle && isOpen && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={onToggle}
                  className="hidden lg:flex p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Colapsar menú"
                >
                  <FontelloIcon
                    name="icon-left"
                    className="text-lg"
                    fallback={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    }
                  />
                </motion.button>
              )}
              {isOpen && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={onClose}
                  className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                >
                  <FontelloIcon
                    name="icon-cancel"
                    className="text-xl"
                    fallback={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    }
                  />
                </motion.button>
              )}
            </div>
          </div>

        {/* Navegación */}
        <nav className="flex-1 overflow-y-auto py-4">
          {menuSections.map((section) => {
            const isExpanded = expandedSections.has(section.title)
            
            return (
              <div key={section.title} className="mb-2">
                {/* Título de la sección */}
                <button
                  onClick={() => toggleSection(section.title)}
                  className="w-full flex items-center justify-between px-6 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {isOpen && (
                    <>
                      <span>{section.title}</span>
                      <FontelloIcon
                        name={isExpanded ? 'icon-up' : 'icon-down'}
                        className="text-xs text-gray-400 dark:text-gray-500"
                        fallback={
                          <svg className="w-3 h-3 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isExpanded ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            )}
                          </svg>
                        }
                      />
                    </>
                  )}
                </button>

                {/* Items de la sección */}
                <AnimatePresence>
                  {isExpanded && isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      {section.items.map((item) => {
                        const isActive = location.pathname === item.path || 
                          location.pathname.startsWith(item.path + '/')
                        
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={onClose}
                            className={cn(
                              'flex items-center px-6 py-2.5 text-sm font-medium transition-colors relative',
                              isActive
                                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-r-2 border-blue-600 dark:border-blue-500'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                            )}
                          >
                            <FontelloIcon
                              name={item.icon}
                              className={cn(
                                'text-lg mr-3',
                                isActive ? 'text-blue-700 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'
                              )}
                              fallback={getIconFallback(item.icon)}
                            />
                            <span className="flex-1">{item.label}</span>
                            {item.badge && (
                              <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </nav>

        {/* Footer del Sidebar */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 transition-colors"
          >
            {/* Botón Cerrar Sesión */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              <FontelloIcon
                name="icon-logout"
                className="text-lg text-gray-600 dark:text-gray-400"
                fallback={
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                }
              />
              <span>Cerrar Sesión</span>
            </button>
            
            {/* Información de versión */}
            <div className="px-6 py-3 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
              <p className="font-medium">Versión 1.0.0</p>
              <p className="mt-1">© 2024 LMS Platform</p>
            </div>
          </motion.div>
        )}
        </div>
      </motion.aside>
    </>
  )
}

export default Sidebar
