import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  TextInput,
  Modal,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import MaskedView from "@react-native-community/masked-view";
import Svg, { Path } from "react-native-svg";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableWithoutFeedback } from "react-native";

//LOADING
import AnimatedLoader from "react-native-animated-loader";

//API Responsive
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

//API AXIOS
import axios from "axios";

//API Firebase
import * as firebase from "firebase";

//React Elemets
import { Avatar } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import TouchableScale from "react-native-touchable-scale";

export default class Jurnal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //Profile
      displayName: null,
      displayCampus: null,
      displayUID: null,
      displayPhone: null,
      displayProfile: null,

      //State Kamus Kesehatan
      title: null,
      description: "<p></p>",
      arrData: "",

      modalVisible: false,

      _loader: false,
    };

    this.DATA = [];
  }

  async componentDidMount() {
    // Access the postId and otherParam via Destructuring assignment
    const { idcampus } = this.props.route.params;

    this._getMenu();

    let user = firebase.auth().currentUser;

    if (user != null) {
      this.setState({
        displayName: user.displayName,
        displayCampus: idcampus,
        displayUID: user.uid,
        displayPhone: user.phoneNumber,
        displayProfile: user.photoURL,
      });
    }
  }

  _getMenu = () => {
    this.setState({ _loader: true });
    axios
      .post(`https://materi-keperawatan-apps.herokuapp.com/API-MKEP`, {
        nameJSON: "jurnal.json",
      })
      .then((res) => {
        this.setState({ arrData: res.data, _loader: false });
        this.DATA = res.data;
      });
  };

  searchFilterFunction = (text) => {
    const newData = this.DATA.filter((item) => {
      const itemData = `${item.title.toUpperCase()}`;

      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });

    this.setState({ arrData: newData });
  };

  render() {
    const Item = ({ title, year, url }) => (
      <TouchableScale
        onPress={() =>
          this.props.navigation.navigate("pdfReader", { urlPDF: url })
        }
      >
        <View style={styles.bgFlatlist}>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Text style={styles.titleFlatlist}>{title}</Text>
            <Text style={styles.titleYear}>{year}</Text>
          </View>
          <View style={{ justifyContent: "center" }}>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={hp("5.5%")}
              color="#4992D1"
            />
          </View>
        </View>
      </TouchableScale>
    );

    const renderItem = ({ item }) => (
      <Item title={item.title} year={item.year} url={item.url} />
    );

    return (
      <View style={styles.stretcher}>
        <StatusBar hidden />

        <AnimatedLoader
          visible={this.state._loader}
          overlayColor="rgba(255,255,255,0.75)"
          source={require("../loading.json")}
          animationStyle={{ height: 200, width: 200 }}
          speed={1}
        />

        {/* HEADER ACCOUNT */}
        <View style={styles.bgHeader}>
          <View style={styles.bgContainer}>
            <MaskedView
              style={styles.maskProfile}
              maskElement={
                <MaterialCommunityIcons
                  style={{ alignSelf: "center", justifyContent: "center" }}
                  name="hexagon"
                  size={hp("15%")}
                  color="black"
                />
              }
            >
              <Avatar
                containerStyle={{
                  alignSelf: "center",
                  justifyContent: "center",
                }}
                size={hp("15%")}
                rounded
                source={{
                  uri:
                    this.state.displayProfile === null
                      ? "https://firebasestorage.googleapis.com/v0/b/materi-keperawatan.appspot.com/o/data%2Fprofile.png?alt=media&token=d99bdc0e-22bf-4749-a792-4d562b52dfcc"
                      : this.state.displayProfile,
                }}
              />
            </MaskedView>
          </View>
          <View style={styles.accContainer}>
            <Text style={styles.accName}>
              {this.state.displayName == null
                ? "Account Name"
                : this.state.displayName}
            </Text>
            <Text style={styles.accCampus}>
              {this.state.displayCampus == null
                ? "Campus"
                : this.state.displayCampus}
            </Text>
          </View>
        </View>
        <View style={styles.subHeader}>
          <View style={styles.subHeaderContainer}>
            <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 171.38 54">
              <Path
                d="M171.38 0c-9.67 0-18.41 5.61-22.6 14.32C137.48 37.8 113.48 54 85.69 54S33.9 37.8 22.6 14.32C18.41 5.61 9.67 0 0 0h171.38z"
                fill="#4992d1"
              />
            </Svg>
          </View>
          <View style={styles.subpartHeaderContainer}></View>
        </View>
        {/* END */}

        <View style={styles.bgContent}>
          <Text style={styles.titleStyle}>Jurnal</Text>

          <View style={styles.bgSearch}>
            <MaterialIcons
              style={{ margin: 5 }}
              name="search"
              size={hp("3%")}
              color="#4992D1"
            />
            <TextInput
              style={{ flex: 1, fontFamily: "Montserrat-Light" }}
              placeholder="Search Kamus Kesehatan"
              onChangeText={(text) => this.searchFilterFunction(text)}
              value={this.state.text}
            />
          </View>
          <FlatList
            style={{
              padding: 5,
              marginHorizontal: wp("1.5%"),
              marginVertical: hp("1.5%"),
            }}
            data={this.state.arrData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.goBack();
          }}
          style={styles.bgBack}
        >
          <MaterialIcons
            name="keyboard-arrow-left"
            size={hp("5%")}
            color="#4992D1"
          />
          <Text
            style={{
              fontSize: hp("2%"),
              fontFamily: "Montserrat-Bold",
              color: "#4992D1",
            }}
          >
            Back to Menu
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  //===========CONTAINER===========
  stretcher: {
    flex: 1,
  },

  //===========HEADER ACCOUNT===========
  bgHeader: {
    backgroundColor: "#4992D1",
    height: 100,
    flexDirection: "row",
  },
  bgContainer: {
    flex: 1,
    justifyContent: "center",
  },
  maskProfile: {
    backgroundColor: "white",
    height: hp("15%"),
    position: "relative",
    top: hp("5%"),
  },

  accContainer: {
    flex: 1,
    marginTop: hp("4%"),
  },
  accName: {
    fontSize: hp("1.8%"),
    textAlign: "right",
    marginEnd: 10,
    color: "white",
    fontFamily: "Montserrat-Bold",
  },
  accCampus: {
    fontSize: hp("1.5%"),
    textAlign: "right",
    marginEnd: 10,
    color: "white",
    fontFamily: "Montserrat-Regular",
  },
  //===========END===========

  //===========SUB HEADER ACCOUNT===========
  subHeader: { height: 50, flexDirection: "row", zIndex: -1 },
  subHeaderContainer: {
    flex: 1,
    backgroundColor: "#EEEEEE",
    justifyContent: "center",
  },
  subpartHeaderContainer: { flex: 1, backgroundColor: "#EEEEEE" },
  //===========END===========

  //===========TITLE HEADER===========
  titleStyle: {
    fontSize: hp("4.5%"),
    color: "#4992D1",
    textAlign: "center",
    marginBottom: 10,
    fontFamily: "Montserrat-Bold",
  },
  //===========END===========

  //===========SUB HEADER ACCOUNT===========
  bgContent: { flex: 1, backgroundColor: "#EEEEEE", paddingVertical: 10 },
  //===========END===========

  //===========HTML STYLES===========
  htmlStyles: {
    flex: 1,
    paddingHorizontal: wp("1%"),
    marginVertical: 10,
  },
  //===========END===========

  //===========SCROLL HTML===========
  scrollHTML: {
    paddingHorizontal: wp("2%"),
    marginVertical: hp("1%"),
    height: hp("85%"),
  },
  //===========END===========

  //===========MODAL STYLE===========
  modalStyle: {
    flex: 1,
    borderRadius: hp("2%"),
    paddingHorizontal: wp("5.5%"),
    paddingVertical: hp("5%"),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  //===========END===========

  //===========TITLE KAMUS===========
  titleKamus: {
    textAlign: "center",
    fontSize: hp("2.5%"),
    fontFamily: "Montserrat-Bold",
  },
  //===========END===========
  //===========BG SEARCH===========
  bgSearch: {
    backgroundColor: "white",
    marginHorizontal: wp("10%"),
    flexDirection: "row",
    alignItems: "center",
    borderRadius: hp("50%"),
  },
  //===========END===========
  //===========BG BACK===========
  bgBack: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: hp("4%"),
    backgroundColor: "#eeeeee",
  },
  //===========END===========
  //===========TITLE FLATLIST===========
  titleFlatlist: {
    fontSize: hp("1%"),
    color: "#4992D1",
    fontFamily: "Montserrat-Bold",
    marginHorizontal: 10,
  },

  titleYear: {
    fontSize: hp("1%"),
    color: "#4992D1",
    fontFamily: "Montserrat-Bold",
    marginHorizontal: 10,
  },
  //===========END===========
  //===========BG FLATLIST===========
  bgFlatlist: {
    backgroundColor: "white",
    borderRadius: 25,
    margin: 5,
    padding: 10,
    flexDirection: "row",
  },
});
