// styles/auth.styles.js
import { StyleSheet } from 'react-native'

const authStyles = StyleSheet.create({
  container: {
    backgroundColor: '#1A1A1A', // dark grey
    padding: 24,
    paddingTop: 48,
    flexGrow: 1,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 24,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#39FF14',
    marginBottom: 24,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    backgroundColor: '#262626', // slightly lighter than container
    borderRadius: 12,
    padding: 20,
  },
  input: {
    backgroundColor: '#2C2C2C',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    color: 'white',
  },
  label: {
    color: '#aaa',
    marginTop: 12,
    marginBottom: 8,
  },
  pickerWrapper: {
    backgroundColor: '#2C2C2C',
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 8,
    height: 44,
    justifyContent: 'center',
    borderColor: '#39FF14', // optional: subtle neon border
  },
  picker: {
    color: 'white',
    height: '100%',
    width: '100%',
  },
  button: {
    backgroundColor: '#39FF14',
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: '#1A1A1A', // contrast for neon green button
    textAlign: 'center',
    padding: 12,
    fontWeight: 'bold',
  },
    progressText: {
    color: 'white',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  miniGoalTitle: {
    color: '#39FF14',
    fontSize: 18,
    marginTop: 32,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  goalItem: {
    marginBottom: 12,
  },
  goalText: {
    color: 'white',
    fontSize: 16,
  },
  goalDone: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  ringCard: {
  backgroundColor: '#262626',
  borderRadius: 16,
  padding: 20,
  marginBottom: 24,
  alignItems: 'center',
  shadowColor: '#39FF14',
  shadowOpacity: 0.2,
  shadowOffset: { width: 0, height: 0 },
  shadowRadius: 8,
},
})

export default authStyles
