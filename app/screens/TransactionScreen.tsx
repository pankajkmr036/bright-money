import { FC } from "react"
import { ViewStyle } from "react-native"
import { AppStackScreenProps } from "@/navigators"
import { Screen, Text } from "@/components"
// import { useNavigation } from "@react-navigation/native"

interface TransactionScreenProps extends AppStackScreenProps<"Transaction"> {}


export const TransactionScreen: FC<TransactionScreenProps> = () => {

  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen style={$root} preset="scroll">
      <Text text="transaction" />
    </Screen>
  )

}

const $root: ViewStyle = {
  flex: 1,
}
