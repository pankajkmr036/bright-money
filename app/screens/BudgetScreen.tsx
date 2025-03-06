import { FC } from "react"
import { ViewStyle } from "react-native"
import { AppStackScreenProps } from "@/navigators"
import { Screen, Text } from "@/components"
// import { useNavigation } from "@react-navigation/native"

interface BudgetScreenProps extends AppStackScreenProps<"Budget"> {}


export const BudgetScreen: FC<BudgetScreenProps> = () => {

  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen style={$root} preset="scroll">
      <Text text="budget" />
    </Screen>
  )

}

const $root: ViewStyle = {
  flex: 1,
}
