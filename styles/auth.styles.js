// styles/auth.styles.js
import { StyleSheet } from 'react-native'

const authStyles = StyleSheet.create({
  container: {
    backgroundColor: '#1A1A1A', // dark grey
    padding: 24,
    paddingTop: 64,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    backgroundColor: '#1A1A1A',
    padding: 24,
    paddingTop: 64,
    flexGrow: 1,
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
    marginTop: 12,
    textAlign: 'center',
  },
  form: {
    width: '95%',
    maxWidth: 500,
    alignSelf: 'center',
    backgroundColor: '#262626', // slightly lighter than container
    borderRadius: 12,
    padding: 24,
  },
  input: {
    backgroundColor: '#2C2C2C',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    color: 'white',
  },
  label: {
    color: '#aaa',
    marginTop: 12,
    marginBottom: 6,
  },
  pickerWrapper: {
    backgroundColor: '#2C2C2C',
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 8,
    height: 40,
    justifyContent: 'center',
    borderColor: '#39FF14',
  },
  picker: {
    color: '#fff',
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
  googleButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  googleButtonText: {
    color: '#000',
    fontWeight: 'bold',
    marginLeft: 8,
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
  goalIcon: {
    marginRight: 8,
  },
  ringCard: {
    backgroundColor: '#262626',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    marginTop: 16,
    alignItems: 'center',
  },
  sectionBox: {
    backgroundColor: '#262626',
    borderRadius: 16,
    padding: 16,
    marginVertical: 12,
    width: '90%',
    alignSelf: 'center',
  },
  goalBox: {
  backgroundColor: '#2a2a2a',
  padding: 12,
  marginVertical: 6,
  borderRadius: 10,
  width: '90%',
  alignSelf: 'center',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},
  waterBox: {
    backgroundColor: '#2a2a2a',
    padding: 16,
    marginVertical: 12,
    borderRadius: 10,
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  waterText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 8,
  },
  list: {
    marginTop: 16,
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default authStyles
