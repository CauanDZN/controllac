import React, {useRef, useState} from 'react';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from 'react-native';

import {Button} from '@/components/Button';
import {settingsStorage} from '@/storage/settingsStorage';

import {
  Container,
  Dot,
  Dots,
  Footer,
  SkipArea,
  SkipButton,
  SkipText,
  Slide,
  SlideIcon,
  SlideText,
  SlideTitle,
} from './styles';

const {width} = Dimensions.get('window');

const slides = [
  {
    icon: 'package-variant-closed',
    title: 'Bem-vindo ao Controllac',
    text: 'Controle de validade de produtos e lotes, 100% offline. Sem internet, sem cadastro, sem mensalidade.',
  },
  {
    icon: 'tag-outline',
    title: 'Cadastre seus produtos',
    text: 'Nome, código de barras e categoria — cadastrado uma vez só e reaproveitado em todas as entregas.',
  },
  {
    icon: 'archive-outline',
    title: 'Registre os lotes',
    text: 'Cada entrega vira um lote com sua própria validade. A lista sempre mostra primeiro o que vence mais cedo.',
  },
  {
    icon: 'bell-ring-outline',
    title: 'Escaneie e receba avisos',
    text: 'Aponte a câmera pro código de barras: o app reconhece produtos já cadastrados. E avisa 3 dias antes de cada lote vencer.',
  },
] as const;

interface Props {
  onFinish: () => void;
}

export function Onboarding({onFinish}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const isLastSlide = currentIndex === slides.length - 1;

  async function handleFinish() {
    await settingsStorage.markOnboardingSeen();
    onFinish();
  }

  function handleScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  }

  function handleNext() {
    if (isLastSlide) {
      handleFinish();
      return;
    }

    scrollViewRef.current?.scrollTo({
      x: width * (currentIndex + 1),
      animated: true,
    });
  }

  return (
    <Container>
      <SkipArea>
        {!isLastSlide && (
          <SkipButton onPress={handleFinish}>
            <SkipText>Pular</SkipText>
          </SkipButton>
        )}
      </SkipArea>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        style={{flex: 1}}>
        {slides.map(slide => (
          <Slide key={slide.title} width={width}>
            <SlideIcon name={slide.icon} />
            <SlideTitle>{slide.title}</SlideTitle>
            <SlideText>{slide.text}</SlideText>
          </Slide>
        ))}
      </ScrollView>

      <Footer>
        <Dots>
          {slides.map((slide, index) => (
            <Dot key={slide.title} isActive={index === currentIndex} />
          ))}
        </Dots>

        <Button
          title={isLastSlide ? 'Começar' : 'Próximo'}
          onPress={handleNext}
        />
      </Footer>
    </Container>
  );
}
