import React, { useState } from 'react';
import type { Personnel } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { soundFx } from '../../utils/audio';
import {
    Users,
    Heart,
    Thermometer,
    Radio,
    Battery,
    Shield,
    Search,
    Filter,
    CheckCircle2,
    AlertTriangle,
    Send
} from 'lucide-react';

interface PersonnelViewProps {
    personnelList: Personnel[];
}

export const PersonnelView: React.FC<PersonnelViewProps> = ({ personnelList }) => {
    const [statusFilter, setStatusFilter] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [pingedId, setPingedId] = useState<string | null>(null);

    const statuses = ['All', 'Base Camp', 'Traverse Field', 'Storm Bivouac'];

    const filteredPersonnel = personnelList.filter(p => {
        const matchesStatus = statusFilter === 'All' || p.locationStatus === statusFilter;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.callsign.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.station.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const handlePing = (id: string) => {
        soundFx.playRadarPing();
        setPingedId(id);
        setTimeout(() => setPingedId(null), 2500);
    };

    const inFieldCount = personnelList.filter(p => p.locationStatus !== 'Base Camp').length;
    const moderateRiskCount = personnelList.filter(p => p.hypothermiaRisk !== 'Nominal').length;

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Top Biometric Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-panel rounded-xl p-4 border-glacier-500/30">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-mono uppercase text-slate-400">Total Station Crew</span>
                        <Users className="w-5 h-5 text-glacier-400" />
                    </div>
                    <div className="text-2xl font-bold font-display text-white mt-1">
                        1,265 <span className="text-sm font-mono font-normal text-glacier-300">Personnel</span>
                    </div>
                    <div className="text-xs text-aurora-400 mt-2 font-mono flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 100% Medical Cleared
                    </div>
                </div>

                <div className="glass-panel rounded-xl p-4 border-glacier-500/30">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-mono uppercase text-slate-400">Deep-Field Traverses</span>
                        <Radio className="w-5 h-5 text-aurora-400" />
                    </div>
                    <div className="text-2xl font-bold font-display text-aurora-300 mt-1">
                        {inFieldCount} <span className="text-sm font-mono font-normal text-slate-300">Active in Field</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-2 font-mono">
                        Direct GPS Transponder Mesh
                    </div>
                </div>

                <div className="glass-panel rounded-xl p-4 border-glacier-500/30">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-mono uppercase text-slate-400">Hypothermia Risk Alert</span>
                        <AlertTriangle className="w-5 h-5 text-hazard-400" />
                    </div>
                    <div className="text-2xl font-bold font-display text-hazard-300 mt-1">
                        {moderateRiskCount} <span className="text-sm font-mono font-normal text-slate-300">Elevated</span>
                    </div>
                    <div className="text-xs text-hazard-400 mt-2 font-mono">
                        {moderateRiskCount > 0 ? 'Storm Bivouac Rewarming Active' : 'All Vital Temps > 36.5°C'}
                    </div>
                </div>

                <div className="glass-panel rounded-xl p-4 border-glacier-500/30">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-mono uppercase text-slate-400">Survival Master Tier</span>
                        <Shield className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="text-2xl font-bold font-display text-purple-300 mt-1">
                        Level 4 <span className="text-sm font-mono font-normal text-slate-300">Arctic Certified</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-2 font-mono">
                        Crevasse & Whiteout Rescue Ready
                    </div>
                </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="glass-panel rounded-2xl p-4 border-glacier-500/25 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1 mr-1">
                        <Filter className="w-3.5 h-3.5" /> Location:
                    </span>
                    {statuses.map((st) => (
                        <button
                            key={st}
                            onClick={() => { soundFx.playClick(); setStatusFilter(st); }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${statusFilter === st
                                ? 'bg-glacier-500/30 text-glacier-200 border border-glacier-400/50 font-semibold'
                                : 'bg-polar-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                                }`}
                        >
                            {st}
                        </button>
                    ))}
                </div>

                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search name, callsign, role..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full glass-input rounded-lg pl-8 pr-3 py-1.5 text-xs placeholder:text-slate-500 font-sans"
                    />
                </div>
            </div>

            {/* Personnel Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredPersonnel.map((person) => {
                    const isPinged = pingedId === person.id;
                    return (
                        <div
                            key={person.id}
                            className="glass-panel-glow rounded-2xl p-5 border-glacier-500/30 hover:border-glacier-400/60 transition-all duration-300 flex flex-col justify-between group"
                        >
                            <div className="space-y-4">
                                {/* Header */}
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-mono font-bold text-glacier-300">
                                                [{person.callsign}]
                                            </span>
                                            <StatusBadge status={person.locationStatus} />
                                        </div>
                                        <h4 className="text-base font-bold font-display text-white mt-1">
                                            {person.name}
                                        </h4>
                                        <p className="text-xs text-slate-400 font-sans">{person.role}</p>
                                    </div>

                                    <div className="p-2 rounded-xl bg-polar-900 border border-glacier-500/30">
                                        <Radio className={`w-4 h-4 ${person.satelliteConnected ? 'text-aurora-400 animate-pulse' : 'text-slate-600'}`} />
                                    </div>
                                </div>

                                {/* Station & Tier */}
                                <div className="p-2.5 rounded-xl bg-polar-900/80 border border-slate-800 text-xs font-mono space-y-1">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Base Station:</span>
                                        <span className="text-slate-300 truncate max-w-[170px]">{person.station}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Survival Cert:</span>
                                        <span className="text-glacier-300">{person.survivalTier}</span>
                                    </div>
                                </div>

                                {/* Live Biometrics HUD */}
                                <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                                    {/* Heart Rate */}
                                    <div className="p-2.5 rounded-xl bg-polar-900/60 border border-slate-800 text-center">
                                        <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
                                            <Heart className="w-3.5 h-3.5 text-distress-400 animate-pulse" /> HR
                                        </div>
                                        <div className="text-base font-bold font-mono text-white mt-1">
                                            {person.heartRateBpm} <span className="text-[10px] text-slate-400 font-normal">bpm</span>
                                        </div>
                                    </div>

                                    {/* Core Temp */}
                                    <div className="p-2.5 rounded-xl bg-polar-900/60 border border-slate-800 text-center">
                                        <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
                                            <Thermometer className="w-3.5 h-3.5 text-glacier-400" /> CORE
                                        </div>
                                        <div className="text-base font-bold font-mono text-glacier-200 mt-1">
                                            {person.coreBodyTempC}°C
                                        </div>
                                    </div>

                                    {/* Transponder Battery */}
                                    <div className="p-2.5 rounded-xl bg-polar-900/60 border border-slate-800 text-center">
                                        <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
                                            <Battery className="w-3.5 h-3.5 text-aurora-400" /> BATT
                                        </div>
                                        <div className="text-base font-bold font-mono text-aurora-300 mt-1">
                                            {person.transponderBatteryPct}%
                                        </div>
                                    </div>
                                </div>

                                {/* Hypothermia warning status */}
                                <div className="flex items-center justify-between text-xs font-mono">
                                    <span className="text-slate-400">Hypothermia Risk:</span>
                                    <span
                                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${person.hypothermiaRisk === 'Critical'
                                            ? 'bg-distress-500/20 text-distress-300 border border-distress-500 animate-pulse'
                                            : person.hypothermiaRisk === 'Moderate'
                                                ? 'bg-hazard-500/20 text-hazard-300 border border-hazard-500'
                                                : 'bg-aurora-500/15 text-aurora-300 border border-aurora-400/30'
                                            }`}
                                    >
                                        {person.hypothermiaRisk}
                                    </span>
                                </div>
                            </div>

                            {/* Bottom Card Action */}
                            <div className="mt-4 pt-3 border-t border-glacier-500/20">
                                <button
                                    onClick={() => handlePing(person.id)}
                                    className={`w-full py-2 px-3 rounded-lg text-xs font-mono font-bold tracking-wider border flex items-center justify-center gap-2 transition-all ${isPinged
                                        ? 'bg-aurora-500/30 text-aurora-200 border-aurora-400 shadow-aurora-glow'
                                        : 'bg-glacier-500/20 hover:bg-glacier-500/30 text-glacier-200 border-glacier-400/40 hover:shadow-glacier-sm'
                                        }`}
                                >
                                    <Send className={`w-3.5 h-3.5 ${isPinged ? 'animate-spin' : ''}`} />
                                    {isPinged ? 'TRANSPONDER ACKNOWLEDGED (LAT/LNG LOCKED)' : 'PING SAT-TRANSPONDER'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
