import React, { useState, useCallback, useEffect} from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, FlatList, Modal, TextInput} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TaskList from './src/components/TaskList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';


import * as Animatable from 'react-native-animatable';

const AnimetedBtn = Animatable.createAnimatableComponent(TouchableOpacity);

export default function App() {
  const [task, setTask] = useState([]);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');

  //Get all tasks when start the App 
  useEffect(() => {
    async function loadTasks(){
      const taskStorage = await AsyncStorage.getItem('@task')
      if (taskStorage){
        setTask(JSON.parse(taskStorage));
      }
    }

    loadTasks();
  }, []);


 //Saving if there is any task changed
  useEffect(() => {
    async function saveTask(){ await AsyncStorage.setItem( '@task', JSON.stringify(task) ); }

    saveTask();

  },[task]);


  function handleAdd(){
    if(input === '') return;

    const data ={
      key: input,
      task:input
    };
    setTask([...task, data]);
    setOpen(false);
    setInput('');
  }

  const handleDelete = useCallback((data) => {
    const find = task.filter(r => r.key !== data.key);
    setTask(find);
  })

  return (
  <SafeAreaView style={styles.container}>
    <StatusBar backgroundColor="#171d31" barStyle="light-content" />
    <View style={styles.content}>
      <Text style={styles.title}> My tasks </Text>
    </View>

    <FlatList 
    marginHorizontal={10}
    showsHorizontalScrollIndicator={false}
    data={task}
    keyExtractor={(item) => String(item.key)}
    renderItem={({ item }) => <TaskList data={item} handleDelete={handleDelete} /> }
    />

    <Modal animationType="slide" transparent={false} visible={open}>
      <SafeAreaView style={styles.modal}>

        <View style={styles.headerModal}>
          <TouchableOpacity onPress={ () => setOpen(false)}>
            <Ionicons style={{marginLeft: 5, marginRight: 5}}name="md-arrow-back" size={40} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.titleModal}>New Task</Text>
        </View>
        
        <Animatable.View 
        style={styles.modalBody} 
        animation="fadeInUp" 
        useNativeDriver>

          <TextInput 
          multiline={true}
          placeholderTextColor="#747474"
          autoCorrect={false}
          placeholder="What do you have to do today?"
          style={styles.input}
          value={input}
          onChangeText={(texto) => setInput(texto)}
          />
          <TouchableOpacity style={styles.handleAdd} onPress={handleAdd}>
            <Text style={styles.addText}>Confirm</Text>
          </TouchableOpacity>
        </Animatable.View>

      </SafeAreaView>
    </Modal>


    <AnimetedBtn 
      style={styles.effectButton}
      useNativeDriver
      animation="bounceInUp"
      duration={1500}
      onPress={() => setOpen(true)}
      >
      <Ionicons name="ios-add" size={35} color="#FFF" />
    </AnimetedBtn>
  </SafeAreaView>
  
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: '#171d31'
  },
  title:{
    marginTop: 10,
    paddingBottom:10,
    fontSize: 30,
    textAlign: 'center',
    color: '#FFF'
  },
  effectButton:{
    position: 'absolute',
    width: 60,
    height: 60,
    backgroundColor: '#0094FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    right: 25,
    bottom: 25,
    elevation: 2,
    zIndex: 9,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {
   width: 1,
   height: 3,
    }
  },
  modal:{
    flex: 1,
    backgroundColor: '#171d31',
  },
  headerModal:{
    marginLeft: 10,
    marginTop:20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  titleModal:{
    marginLeft: 15,
    fontSize: 25,
    color: '#FFF'
  },
  modalBody:{
    marginTop:15,
  },
  input:{
    color: '#000',
    marginTop:30,
    marginLeft:10,
    fontSize: 15,
    marginRight:10,
    backgroundColor: '#FFF',
    borderRadius: 5,
    height: 100,
    textAlignVertical: 'top',
    padding: 9,
  },
  handleAdd:{
    alignItems: 'center',
    marginTop:10,
    backgroundColor: '#FFF',
    marginRight: 10,
    marginLeft: 10,
    justifyContent: 'center',
    height: 40,
    borderRadius: 5
  },
  addText: {
    fontSize: 23
  }
});