import { Image, StyleSheet, Text, TouchableNativeFeedback, View } from "react-native"
import { ApodEntry } from "../data/apod.types"


type Props = {
    item: ApodEntry,
    onPress: (item: ApodEntry) => void
}

export function ApodItem({ item, onPress }: Props) {
    return (
        <TouchableNativeFeedback onPress={() => onPress(item)}>
            <View style={styles.container}>
                <View style={styles.textContainer}>
                    <Text style={{ color: 'white' }}>{item.title}</Text>
                    <Text style={{ color: 'white' }}>{item.date}</Text>
                </View>
                <Image style={styles.image} source={{ uri: item.url }}></Image>
            </View>
        </TouchableNativeFeedback >
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 16
    },
    textContainer: {
        flex: 1,
        marginRight: 16,
    },
    image: {
        width: '33%',
        aspectRatio: 16 / 9
    }
})