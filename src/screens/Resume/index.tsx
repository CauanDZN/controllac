import AsyncStorage from "@react-native-async-storage/async-storage";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from "@react-navigation/native";
import { addMonths, format, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import React, { useCallback, useState } from "react";
import { ActivityIndicator } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useTheme } from "styled-components";
import { VictoryPie } from "victory-native";
import { HistoryCard } from "../../components/HistoryCard";
import { useAuth } from "../../hooks/auth";
import { categories } from "../../utils/categories";
import {
  ChartContainer,
  Container,
  Content,
  Header,
  LoadingContainer,
  Month,
  MonthSelect,
  MonthSelectButton,
  MonthSelectIcon,
  Title,
} from "./styles";

interface TransactionData {
  name: string;
  barcode: string;
  category: string;
  date: string;
}

interface CategoryData {
  key: string;
  name: string;
}

export function Resume(): JSX.Element {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const { user } = useAuth();

  function handleChangeDate(action: "previous" | "next") {
    if (action === "next") setSelectedDate(addMonths(selectedDate, 1));
    else setSelectedDate(subMonths(selectedDate, 1));
  }
  async function loadData() {
    setIsLoading(true);
    const dataKey = `@gofinances:transactions_user:${user.id}`;
    const response = await AsyncStorage.getItem(dataKey);
    const responseFormatted = response ? JSON.parse(response) : [];

    const expensives = responseFormatted.filter(
      ({ date }: TransactionData) =>
        new Date(date).getMonth() === selectedDate.getMonth() &&
        new Date(date).getFullYear() === selectedDate.getFullYear()
    );

    const totalByCategory: CategoryData[] = [];

    categories.forEach(({ key, name, color }) => {
      let categorySum = 0;

      totalByCategory.push({
        key,
        name
      });
    }
    );
    setTotalByCategories(totalByCategory);

    setIsLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [selectedDate])
  );
  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>
      {isLoading ? (
        <LoadingContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadingContainer>
      ) : (
        <Content
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: useBottomTabBarHeight(),
          }}
        >
          <MonthSelect>
            <MonthSelectButton onPress={() => handleChangeDate("previous")}>
              <MonthSelectIcon name="chevron-left" />
            </MonthSelectButton>
            <Month>
              {format(selectedDate, "MMMM, yyyy", { locale: ptBR })}
            </Month>
            <MonthSelectButton onPress={() => handleChangeDate("next")}>
              <MonthSelectIcon name="chevron-right" />
            </MonthSelectButton>
          </MonthSelect>

          <ChartContainer>
            <VictoryPie
              style={{
                labels: {
                  fontSize: RFValue(18),
                  fontWeight: "bold",
                  fill: theme.colors.shape,
                },
              }}
              data={totalByCategories}
              labelRadius={50}
              x="percentFormatted"
              y="total"
            />
          </ChartContainer>
          {totalByCategories.map(({ name, key }) => (
            <HistoryCard
              key={key}
              title={name}
            />
          ))}
        </Content>
      )}
    </Container>
  );
}