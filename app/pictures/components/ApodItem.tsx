import { Image, StyleSheet, Text, TouchableNativeFeedback, useWindowDimensions, View } from "react-native"
import { ApodEntry } from "../../data/apod.types"
import { secondaryText } from "../../theme/styles"


type Props = {
    item: ApodEntry,
    onPress: (item: ApodEntry) => void
}

export function ApodItem({ item, onPress }: Props) {
    const { width, height } = useWindowDimensions()
    const isPortrait = width < height
    return (
        <TouchableNativeFeedback onPress={() => onPress(item)}>
            <View style={styles.container}>
                <View style={styles.textContainer}>
                    <Text style={{ color: 'white', paddingBottom: 4 }}>{item.title}</Text>
                    <Text style={{ color: secondaryText }}>{item.date}</Text>
                </View>
                <Image style={(isPortrait) ? styles.imagePortrait : styles.imageLandscape} source={{ uri: item.url }}></Image>
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
    imagePortrait: {
        width: '30%',
        aspectRatio: 16 / 9
    },
    imageLandscape: {
        width: '15%',
        aspectRatio: 16 / 9
    }
})