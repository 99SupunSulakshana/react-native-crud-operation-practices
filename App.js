import React, {useEffect, useState} from "react";
import { TouchableOpacity } from "react-native";
import CheckBox from 'react-native-check-box'
import { Text, SafeAreaView, View, ScrollView, StyleSheet, Modal, TextInput } from "react-native"

const App = () => {

    const [list, setList] = useState([]);
    let taskList = [];
    const [modelTeacher, setModelTeacher] = useState(false);
    const [isSelected, setSelection] = useState(false);
    const [taskTitle, setTitle] = useState("");
    const [taskUuid, setUuid] = useState("");


    useEffect(()=>{
        getListTasks();
    }, [])

    const getListTasks = () => {
        fetch("https://crudapi.co.uk/api/v1/task",{
            method: "GET",
            headers: {
                "Authorization": "Bearer tkeE18eKVFy0xotwKezWKSt9olgwwsNxp4_20KEMpc-plGGVpA",
                "Content-Type": "application/json",
                "Accept":"application/json"
            },
        }).then(res=>{
            return res.json()
        }).then(res=>{
            taskList = res.items.map(item => ({
                title: item.title,
                completed: item.completed,
                uuid: item._uuid,
                createdAt: item._created
            }));
            setList(taskList)
            console.log(res)
        }).catch(err=>{
            console.log(err)
        })
    }

    const handleRemove = (itemUUID) => {
        console.log(itemUUID);
        const taskArray = [
            {"_uuid": itemUUID}
        ];
        fetch("https://crudapi.co.uk/api/v1/task", {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer tkeE18eKVFy0xotwKezWKSt9olgwwsNxp4_20KEMpc-plGGVpA",
                "Content-Type": "application/json",
                "Accept":"application/json"
            },
            body: JSON.stringify(taskArray),
        }).then(res=>{
            return res.json()
        }).then(res=>{
            console.log(res);
            alert("Successfully deleted!");
            getListTasks();
        }).catch(err =>{
            console.log(err);
        })
    }

    const createNewTask = () => {
        setModelTeacher(true);
    }

    const handleCloseModal = () => {
        setUuid("");
        setModelTeacher(false);
    }

    const handleOnClickForCheckBox = () => {
        setSelection(!isSelected);
    }

    const handleSave = () => {
       if(taskUuid != null){
        handleUpdateRequest();
       }else{
        postRequest();
       }
    };


    postRequest = () => {
        const taskArray = [
            { "title": taskTitle, "completed": isSelected }
        ];
    
        fetch("https://crudapi.co.uk/api/v1/task", {
            method: "POST",
            headers: {
                "Authorization": "Bearer tkeE18eKVFy0xotwKezWKSt9olgwwsNxp4_20KEMpc-plGGVpA",
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(taskArray),
        })
        .then(res => res.json())
        .then(res => {
            console.log(res);
            getListTasks();
            setModelTeacher(false);
            setSelection(false);
            setTitle("");
        })
        .catch(err => {
            console.log(err);
        });
    }
    
    const handleEdit = (item) => {
        setTitle(item.title);
        setSelection(item.completed);
        setModelTeacher(true);
        setUuid(item.uuid);
    }

    const handleUpdateRequest = () => {
        const taskArray =[{"_uuid": taskUuid, "completed": isSelected}];
        console.log("task uui "+ taskUuid);
        fetch("https://crudapi.co.uk/api/v1/task", {
            method: "PUT",
            headers: {
                "Authorization": "Bearer tkeE18eKVFy0xotwKezWKSt9olgwwsNxp4_20KEMpc-plGGVpA",
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(taskArray),
        })
        .then(res => res.json())
        .then(res => {
            console.log(res);
            getListTasks();
            setModelTeacher(false);
            setSelection(false);
            setTitle("");
            setUuid("");
            alert("updated successfully!");
        })
        .catch(err => {
            console.log(err);
        });
    }

    return (
        <SafeAreaView>
            <Modal visible={modelTeacher}>
                <SafeAreaView>
                    <View style={[styles.rowBetween, {paddingHorizontal:10}]}>
                        <Text style={styles.txtTitle}>New Task</Text>
                        <TouchableOpacity onPress={handleCloseModal}>
                            <Text style={styles.txtClose}>Close</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{paddingHorizontal:10, marginTop:20}}>
                        <Text>Task title</Text>
                        <TextInput 
                        style={styles.textInput}
                        value={taskTitle}
                        placeholder="Task title"
                        onChangeText={(text)=>{
                            setTitle(text)
                        }}
                        />
                    </View>
                    <View>
                    <View style={[styles.rowBetween, {paddingHorizontal:10}]}>
                        <CheckBox
                            style={{flex: 1, padding: 10}}
                            onClick={handleOnClickForCheckBox}
                            isChecked={isSelected}
                            leftText={"Completed or Not"}
                        />
                   
                    </View>
                    <View style={[{paddingHorizontal:10, marginTop:20}]}>
                        <TouchableOpacity onPress={handleSave} style={[styles.btnContainer, {paddingHorizontal:10}]}>
                                <Text>Save task</Text>
                        </TouchableOpacity>
                    </View>
                    </View>
                </SafeAreaView>
            </Modal>
            <View style={styles.rowBetween}>
                <Text style={styles.txtMain}>Task List {list.length}</Text>
                <TouchableOpacity style={{padding:10}} onPress={createNewTask}>
                    <Text style={{color:"blue", fontWeight:"bold"}}>Create a New Task</Text>
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{
            paddingHorizontal : 10,
            paddingVertical: 10}}>
                {list.map((item, index)=>{
                    return (
                        <View style={styles.rowBetween}>
                            <View style={styles.item} key={index}>
                                <Text style={styles.txtTitle}>{item.title}</Text>
                                <Text style={styles.txtNormal}>{item.createdAt}</Text>
                            </View>
                            <View>
                                <TouchableOpacity onPress={()=>handleRemove(item.uuid)}>
                                    <Text style={styles.txtDelete}>Delete</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>handleEdit(item)}>
                                    <Text style={styles.txtUpdate}>Update</Text>
                                </TouchableOpacity>
                            </View>
                        </View>  
                    )
                })}
            </ScrollView>
        </SafeAreaView>
    )
}

export default App;

const styles = StyleSheet.create({
    txtMain:{
        fontSize:16,
        fontWeight:"bold",
        padding: 20
    },
    item:{
        paddingVertical:10,
        paddingHorizontal:1
    },
    txtTitle: {
        fontSize: 16,
        fontWeight: "bold"
    },
    txtNormal: {
        fontSize: 12,
        fontWeight: "thin",
        color:"#444"
    },
    txtDelete: {
        color: "red"
    },
    txtUpdate: {
        color: "orange"
    },
    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical:10,
        borderBottomWidth: 1,
        borderBottomColor: "#888"
    },
    txtClose: {
        fontSize: 16,
        fontWeight: "bold",
        color:"gray"
    },
    txtTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color:"blue"
    },
    textInput : {
        padding: 10,
        borderWidth: 1,
        borderColor:"#888",
        marginBottom:10,
        
    },
    btnContainer :{
        borderWidth:1,
        borderColor:"#7659",
        padding: 10,
        backgroundColor: "green",
        textAlign: "center",
        justifyContent:"center",
        alignItems:"center"
    }
})