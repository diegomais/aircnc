import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#f05a5b',
    borderRadius: 4,
    height: 42,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    marginTop: 10,
  },
  container: {
    margin: 30,
  },
  input: {
    borderColor: '#ddd',
    borderRadius: 4,
    borderWidth: 1,
    color: '#444',
    fontSize: 16,
    height: 44,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  label: {
    color: '#444',
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 30,
  },
  logo: {
    alignSelf: 'center',
    height: 32,
    resizeMode: 'contain',
  },
});
