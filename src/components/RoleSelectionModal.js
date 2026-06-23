import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, ScrollView } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import i18n from '../i18n';
import { RoleEngine, PlayerRole } from '../services/RoleEngine';

const { width, height } = Dimensions.get('window');

export default function RoleSelectionModal({ visible, onRoleSelected }) {
  
  const handleSelect = async (role) => {
    await RoleEngine.setRole(role);
    onRoleSelected(role);
  };

  const renderCard = (role, icon, color, titleKey, descKey) => {
    return (
      <TouchableOpacity 
        style={[styles.card, { borderColor: color }]} 
        activeOpacity={0.8}
        onPress={() => handleSelect(role)}
      >
        <View style={[styles.iconContainer, { backgroundColor: color }]}>
          <Feather name={icon} size={28} color="#fff" />
        </View>
        <View style={styles.cardContent}>
          <Text style={[styles.cardTitle, { color }]}>{i18n.t(`roles.${titleKey}`)}</Text>
          <Text style={styles.cardDesc}>{i18n.t(`roles.${descKey}`)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{i18n.t('roles.title')}</Text>
          <Text style={styles.subtitle}>{i18n.t('roles.subtitle')}</Text>
          
          <ScrollView 
            style={styles.scroll} 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {renderCard('gatherer', 'layers', '#4CAF50', 'gatherer', 'gatherer_desc')}
            {renderCard('explorer', 'compass', '#2196F3', 'explorer', 'explorer_desc')}
            {renderCard('survivor', 'shield', '#F44336', 'survivor', 'survivor_desc')}
            {renderCard('trader', 'dollar-sign', '#FFC107', 'trader', 'trader_desc')}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width * 0.9,
    maxHeight: height * 0.8,
    backgroundColor: '#1a100a',
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: '#E9BC62',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    color: '#E9BC62',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  scroll: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingBottom: 10,
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginBottom: 4,
  },
  cardDesc: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#aaa',
  },
});
