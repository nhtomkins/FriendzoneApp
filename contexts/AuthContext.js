import React, { useContext, useState, useEffect } from 'react'
import { auth, firestore, storage } from '../config/Firebase'
import firebase from 'firebase/app'

const AuthContext = React.createContext()

function calculateAge(birthday) {
  // birthday is a date
  if (birthday) {
    var today = new Date()
    //var birthDate = new Date(birthday.toDate());
    var age = today.getFullYear() - birthday.getFullYear()
    var m = today.getMonth() - birthday.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
      age--
    }

    return age
  }
}

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState()
  const [userData, setUserData] = useState(null)
  const [allUsers, setAllUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [friendsLoading, setFriendsLoading] = useState(true)
  const [messagesLoading, setMessagesLoading] = useState(true)
  const [loadPercent, setLoadPercent] = useState(0)
  const [friendsProfiles, setFreindsProfiles] = useState(null)
  const [messages, setMessages] = useState(null)

  function signup(email, password, userDetails) {
    const signupDate = firebase.firestore.Timestamp.now()
    const userAge = calculateAge(userDetails.birthday)
    let userId = ''

    return auth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        userId = userCredential.user.uid
        firestore.collection('users').doc(`${userId}`).set({
          userId,
          likedUsers: [],
          firstname: userDetails.firstname,
          gender: userDetails.gender,
          city: userDetails.city,
          age: userAge,
          checklist: {},
        })
      })
      .then(() => {
        firestore
          .collection('users')
          .doc(`${userId}`)
          .collection('private')
          .add({
            signupDate,
            birthday: userDetails.birthday,
            lastname: userDetails.lastname,
            email,
          })
      })
      .catch((err) => console.error(err))
  }

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password)
  }

  function logout() {
    return auth.signOut()
  }

  /*
  function getUserData(user) {
    firestore.collection('users').doc(`${user.uid}`).get()
      .then(docSnapshot => {
        if(docSnapshot.exists) {
          setUserData(docSnapshot.data())
          setProfileImgUrl(docSnapshot.data().profileImgUrl)
        }
      })
      .catch(err => console.error(err))
  }
  */

  function writeUserData(userDetails) {
    return firestore
      .collection('users')
      .doc(`${currentUser.uid}`)
      .update(userDetails)
      .catch((err) => console.error(err))
  }

  function getAllUsers() {
    return (
      firestore
        .collection('users')
        .where('checklist.complete', '==', true)
        //.where('userId', '!=', currentUser.uid)
        .get()
        .catch((err) => console.error(err))
    )
  }

  function updateUserImage(file, id) {
    const imageExtension = file.name.split('.')[file.name.split('.').length - 1]
    const storageRef = storage.ref(
      `userImages/${currentUser.uid}/${id}.${imageExtension}`,
    )

    storageRef.put(file).on(
      'state_changed',
      (snapshot) => {
        let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setLoadPercent(percentage)
        console.log('Upload is ' + percentage + '% done')
      },
      (err) => {
        console.error(err)
      },
      async () => {
        const url = await storageRef.getDownloadURL()
        writeUserData({ [`${id}ImgUrl`]: url })
      },
    )
  }

  function sendPrivateMessage(message, toUserId) {
    const sentAt = firebase.firestore.Timestamp.now()

    return firestore
      .collection('users')
      .doc(`${currentUser.uid}`)
      .collection('messages')
      .add({
        sentAt,
        message,
        toUserId,
      })
      .then((result) => {
        firestore
          .collection('users')
          .doc(`${toUserId}`)
          .collection('messages')
          .add({
            sentAt,
            message,
            fromUserId: currentUser.uid,
          })
      })
      .then((result) => {
        firestore
          .collection('users')
          .doc(`${currentUser.uid}`)
          .collection('friends')
          .doc(`${toUserId}`)
          .update({
            lastMessage: sentAt,
          })
      })
      .then((result) => {
        firestore
          .collection('users')
          .doc(`${toUserId}`)
          .collection('friends')
          .doc(`${currentUser.uid}`)
          .update({
            lastMessage: sentAt,
          })
      })
      .catch((err) => console.error(err))
  }

  function likeUser(user) {
    if (!userData.likedUsers.includes(user.userId)) {
      firestore
        .collection('users')
        .doc(`${currentUser.uid}`)
        .update({
          likedUsers: firebase.firestore.FieldValue.arrayUnion(user.userId),
        })
        .then((result) => {
          if (user.likedUsers.includes(currentUser.uid)) {
            const dbTime = firebase.firestore.Timestamp.now()
            firestore
              .collection('users')
              .doc(`${currentUser.uid}`)
              .collection('friends')
              .doc(`${user.userId}`)
              .set({
                userId: user.userId,
                addedOn: dbTime,
                lastMessage: dbTime,
              })
            firestore
              .collection('users')
              .doc(`${user.userId}`)
              .collection('friends')
              .doc(`${currentUser.uid}`)
              .set({
                userId: currentUser.uid,
                addedOn: dbTime,
                lastMessage: dbTime,
              })
          }
        })
        .catch((err) => console.error(err))
    }
  }

  function unlikeUser(user) {
    if (userData.likedUsers.includes(user.userId)) {
      firestore
        .collection('users')
        .doc(`${currentUser.uid}`)
        .update({
          likedUsers: firebase.firestore.FieldValue.arrayRemove(user.userId),
        })
        .then((result) => {
          if (user.likedUsers.includes(currentUser.uid)) {
            firestore
              .collection('users')
              .doc(`${currentUser.uid}`)
              .collection('friends')
              .doc(`${user.userId}`)
              .delete()
            firestore
              .collection('users')
              .doc(`${user.userId}`)
              .collection('friends')
              .doc(`${currentUser.uid}`)
              .delete()
          }
        })
        .catch((err) => console.error(err))
    }
    //need to handle messages here also
  }

  function getFriendData(doc) {
    let idArray = []
    let addedOnArray = []
    doc.forEach((profile) => {
      idArray.push(profile.data().userId)
      addedOnArray.push(profile.data().addedOn)
    })

    if (idArray.length > 0) {
      firestore
        .collection('users')
        .where('userId', 'in', idArray)
        .get()
        .then((snap) => {
          let dataArray = []
          snap.forEach((data) => {
            dataArray.push(data.data())
          })
          let sortedData = []
          idArray.forEach((uid, index) => {
            sortedData.push({
              ...dataArray.find((value) => {
                return value.userId === uid
              }),
              addedOn: addedOnArray[index],
            })
          })
          setFreindsProfiles(sortedData)
          setFriendsLoading(false)
        })
        .catch((err) => console.error(err))
    }
  }

  function getInterestsData() {
    return firestore
      .collection('interests')
      .get()
      .catch((err) => console.error(err))
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      (user) => {
        setCurrentUser(user)
        setLoading(false)
      },
      (err) => console.error(err),
    )

    return unsubscribe
  }, [])

  useEffect(() => {
    if (currentUser) {
      const unsubscribe = firestore
        .collection('users')
        .doc(`${currentUser.uid}`)
        .onSnapshot(
          (doc) => {
            if (doc.exists) {
              console.log('user snapshot fired')
              setUserData(doc.data())
            }
          },
          (err) => console.error(err),
        )

      return unsubscribe
    }
  }, [currentUser])

  useEffect(() => {
    if (currentUser) {
      const unsubscribe = firestore
        .collection('users')
        .doc(`${currentUser.uid}`)
        .collection('friends')
        .orderBy('lastMessage', 'desc')
        .onSnapshot(
          (doc) => {
            if (!doc.empty) {
              console.log('friends snapshot fired')
              getFriendData(doc)
            }
          },
          (err) => console.error(err),
        )

      return unsubscribe
    }
  }, [currentUser])

  useEffect(() => {
    if (currentUser) {
      const unsubscribe = firestore
        .collection('users')
        .doc(`${currentUser.uid}`)
        .collection('messages')
        .orderBy('sentAt', 'desc')
        .onSnapshot(
          (doc) => {
            if (!doc.empty) {
              console.log('messages snapshot fired')
              let messageData = []
              doc.forEach((msg) => {
                messageData.push(msg.data())
              })

              if (messageData.length > 0) {
                messageData.reverse()
                setMessages(messageData)
                setMessagesLoading(false)
              }
            }
          },
          (err) => console.error(err),
        )

      return unsubscribe
    }
  }, [currentUser])

  //check to see if profile is complete - move to cloud function at later date
  useEffect(() => {
    if (userData) {
      let profileImage = false
      let fiveInterests = false
      let fiveHighlights = false
      let verified = false
      let complete = false

      if (userData.profileImgUrl) {
        profileImage = true
      }

      if (
        (userData.activities?.length || 0) +
          (userData.lifestyle?.length || 0) +
          (userData.movies?.length || 0) +
          (userData.music?.length || 0) +
          (userData.sports?.length || 0) >=
        5
      ) {
        fiveInterests = true
      }

      if (userData.highlights?.length === 5) {
        fiveHighlights = true
      }

      if (profileImage && fiveInterests && fiveHighlights) {
        complete = true
      }
      if (
        userData.checklist?.profileImage != profileImage ||
        userData.checklist?.fiveInterests != fiveInterests ||
        userData.checklist?.fiveHighlights != fiveHighlights ||
        userData.checklist?.complete != complete ||
        !userData.hasOwnProperty('checklist')
      ) {
        writeUserData({
          checklist: {
            profileImage,
            fiveInterests,
            fiveHighlights,
            verified,
            complete,
          },
        })
      }
    }
  }, [userData])

  const value = {
    currentUser,
    userData,
    allUsers,
    loadPercent,
    friendsProfiles,
    friendsLoading,
    messages,
    messagesLoading,
    writeUserData,
    updateUserImage,
    signup,
    login,
    logout,
    likeUser,
    unlikeUser,
    sendPrivateMessage,
    getInterestsData,
    getAllUsers,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
