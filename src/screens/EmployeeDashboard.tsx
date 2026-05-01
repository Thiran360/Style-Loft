import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity 
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../theme/colors';
import { CustomButton } from '../components/CustomButton';
import { LogOut, Users, Sparkles, ChevronRight } from 'lucide-react-native';

export const EmployeeDashboard = ({ navigation }: any) => {
  const { user, employees, signOut } = useAuth();

  const renderTeamMember = ({ item }: any) => (
    <View style={styles.teamCard}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{(item.name || 'S').charAt(0)}</Text>
      </View>
      <View style={styles.teamInfo}>
        <Text style={styles.teamName}>{item.name || 'Staff Member'}</Text>
        <Text style={styles.teamRole}>{item.role}</Text>
      </View>
      {item.id === user?.id && (
        <View style={styles.youBadge}>
          <Text style={styles.youText}>YOU</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Hello, Professional</Text>
          <Text style={styles.userName}>{user?.name || 'Professional'}</Text>
        </View>
        <TouchableOpacity onPress={signOut} style={styles.logoutButton}>
          <LogOut size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.actionCard}>
        <Sparkles size={32} color={Colors.primary} />
        <View style={styles.actionContent}>
          <Text style={styles.actionTitle}>Service Catalog</Text>
          <Text style={styles.actionDesc}>View services and start a session</Text>
        </View>
        <CustomButton 
          title="GO" 
          onPress={() => navigation.navigate('ServiceCategory')}
          style={styles.goButton}
          textStyle={{ fontSize: 14 }}
        />
      </View>

      <View style={styles.sectionHeader}>
        <Users size={20} color={Colors.primary} />
        <Text style={styles.sectionTitle}>Our Team</Text>
      </View>
      
      <FlatList
        data={employees}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTeamMember}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 14,
    color: Colors.textSecondary,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
    marginTop: 4,
  },
  logoutButton: {
    padding: 10,
    backgroundColor: Colors.surface,
    borderRadius: 12,
  },
  actionCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: 24,
    padding: 24,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 182, 193, 0.2)',
    elevation: 10,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  actionContent: {
    flex: 1,
    marginLeft: 16,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  actionDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  goButton: {
    width: 60,
    height: 48,
    marginVertical: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginLeft: 10,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  teamCard: {
    backgroundColor: Colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0, 0.05)',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 182, 193, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 182, 193, 0.3)',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primary,
  },
  teamInfo: {
    flex: 1,
    marginLeft: 16,
  },
  teamName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  teamRole: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  youBadge: {
    backgroundColor: 'rgba(255, 182, 193, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  youText: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: '900',
  },
});
