import { FC } from "react"
import { ViewStyle } from "react-native"
import { AppStackScreenProps } from "@/navigators"
import { Screen, Text } from "@/components"
// import { useNavigation } from "@react-navigation/native"

interface DashboardScreenProps extends AppStackScreenProps<"Dashboard"> {}


export const DashboardScreen: FC<DashboardScreenProps> = () => {

  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen style={$root} preset="scroll">
      <Text text="dashboard" />
    </Screen>
  )

}

const $root: ViewStyle = {
  flex: 1,
}
