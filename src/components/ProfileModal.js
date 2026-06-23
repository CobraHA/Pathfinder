import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, ScrollView } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import i18n from '../i18n';
import { LevelEngine, LevelStats } from '../services/LevelEngine';
import { RoleEngine, PlayerRole } from '../services/RoleEngine';

const { width, height } = Dimensions.get('window');

export default function ProfileModal({ visible, onClose }) {
  const [stats, setStats] = useState({ level: 1, currentXP: 0, totalQuests: 0, totalGathers: 0, totalChests: 0 });
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (visible) {
      loadProfile();
    }
  }, [visible]);

  const loadProfile = async () => {
    const s = await LevelEngine.getStats();
    setStats(s);
    setRole(RoleEngine.getCurrentRole());
  };

  const getNextLevelXP = () => {
    return LevelEngine.getNextLevelXP(stats.level);
  };

  const xpProgress = Math.min(100, (stats.currentXP / getNextLevelXP()) * 100);

  const renderStatRow = (icon: string, label: string, value: number) => (
    <View style={styles.statRow}>
      <Feather name={icon} size={20} color="#E9BC62" style={{ marginRight: 10 }} />
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );

  return (
    <Modal 
      visible={visible} 
      animationType="slide" 
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Feather name="x" size={24} color="#ccc" />
          </TouchableOpacity>
          
          <Text style={styles.title}>{i18n.t('profile.title', { defaultValue: 'Spieler Profil' })}</Text>
          
          {/* Level & XP Section */}
          <View style={styles.section}>
            <View style={styles.levelHeader}>
              <Text style={styles.levelText}>Level {stats.level}</Text>
              <Text style={styles.xpText}>{stats.currentXP} / {getNextLevelXP()} XP</Text>
            </View>
            <View style={styles.xpBarBG}>
              <View style={[styles.xpBarFill, { width: `${xpProgress}%` }]} />
            </View>
          </View>

          {/* Role Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{i18n.t('profile.role', { defaultValue: 'Spezialisierung' })}</Text>
            <View style={styles.roleBox}>
              <Feather 
                name={role === 'gatherer' ? 'layers' : role === 'explorer' ? 'compass' : role === 'survivor' ? 'shield' : 'dollar-sign'} 
                size={24} 
                color="#E9BC62" 
              />
              <Text style={styles.roleText}>{role ? i18n.t(`roles.${role}`) : '-'}</Text>
            </View>
          </View>

          {/* Statistics Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{i18n.t('profile.stats', { defaultValue: 'Statistiken' })}</Text>
            {renderStatRow('check-circle', i18n.t('profile.quests', { defaultValue: 'Erledigte Quests' }), stats.totalQuests)}
            {renderStatRow('archive', i18n.t('profile.chests', { defaultValue: 'Geöffnete Truhen' }), stats.totalChests)}
            {renderStatRow('package', i18n.t('profile.gathers', { defaultValue: 'Gesammelte Rohstoffe' }), stats.totalGathers)}
          </View>

      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a100a',
    padding: 24,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#E9BC62',
    textAlign: 'center',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  levelText: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    color: '#FFD700',
  },
  xpText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#aaa',
  },
  xpBarBG: {
    height: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#ccc',
    marginBottom: 12,
  },
  roleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 12,
    borderRadius: 8,
  },
  roleText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#fff',
    marginLeft: 12,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  statLabel: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#ccc',
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#E9BC62',
  },
});
