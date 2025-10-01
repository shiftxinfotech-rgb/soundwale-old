import {Icons} from '@assets';
import {Text} from '@components';
import {useUserId, useUserInfo} from '@hooks';
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import {nanoid} from '@reduxjs/toolkit';
import {useLazySendChatNotificationQuery} from '@services';
import {AppStyle, Colors, CommonStyle, TS, VS} from '@theme';
import {
  ChatHelper,
  Scale,
  setField,
  useChatMessages,
  useUserPresence,
} from '@util';
import moment from 'moment';
import React, {useCallback, useEffect, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {Platform, StatusBar, TouchableOpacity, View} from 'react-native';
import {
  BubbleProps,
  GiftedChat,
  IMessage,
  SendProps,
} from 'react-native-gifted-chat';
import {KeyboardAvoidingView} from 'react-native-keyboard-controller';
import {ActivityIndicator} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {NavigationParamStack} from 'src/data/types/NavigationParams';
import CustomChatBubble from './Components/CustomChatBubble';
import SendButton from './Components/SendButton';
export default function ChatDetails({
  route,
}: {
  route: RouteProp<NavigationParamStack, 'ChatDetail'>;
}) {
  const {t} = useTranslation('generic');
  const {goBack, addListener} = useNavigation();
  const {chatItem} = route.params;
  const uInfo = useUserInfo();
  const currentUserId = useUserId();
  const isInChat = useRef(false);
  const {
    productId,
    userInfo: {
      receiver: {id: receiverId, avatar: receiverAvatar, name: receiverName},
      sender: {id: senderId, avatar: senderAvatar, name: senderName},
    },
  } = chatItem || {};
  const {online, lastSeen} = useUserPresence(receiverId);
  const {messages, loading} = useChatMessages(productId, senderId, receiverId);
  const {top, bottom} = useSafeAreaInsets();

  const [sendNotification] = useLazySendChatNotificationQuery();

  useFocusEffect(
    useCallback(() => {
      if (chatItem?.threadId && currentUserId) {
        ChatHelper.markChatAsRead(chatItem.threadId, currentUserId);
        ChatHelper.resetUnread(chatItem.threadId, currentUserId);
      }
    }, [chatItem.threadId, currentUserId]),
  );

  useEffect(() => {
    addListener('blur', () => {
      if (currentUserId) {
        ChatHelper.makeChatInactive(currentUserId!.toString());
      }
    });
  }, [addListener, currentUserId]);

  useEffect(() => {
    const handleOperations = async () => {
      if (currentUserId && receiverId) {
        await ChatHelper.makeChatActive(chatItem.threadId, currentUserId);
      }
      const activeId = await ChatHelper.getActiveChatID(receiverId);
      if (activeId === chatItem.threadId) {
        isInChat.current = true;
      } else {
        isInChat.current = false;
      }
    };
    handleOperations();
    return () => {
      if (currentUserId) {
        ChatHelper.makeChatInactive(currentUserId);
      }
    };
  }, [receiverId, currentUserId, chatItem.threadId]);

  const handleSend = useCallback(
    async (newMessages: IMessage[] = []) => {
      const [msg] = newMessages;
      const message: IMessage = {
        _id: msg._id || nanoid(),
        text: msg.text,
        createdAt: new Date(),
        user: {
          _id: uInfo?.id ?? '',
          name:
            uInfo?.id?.toString() === receiverId ? receiverName : senderName,
          avatar:
            uInfo?.id?.toString() === receiverId
              ? receiverAvatar
              : senderAvatar,
        },
      };
      await ChatHelper.sendNewMessage(chatItem.threadId, message);
      await ChatHelper.restoreChatIfDeleted(chatItem.threadId, receiverId);
      if (!isInChat.current) {
        ChatHelper.updateUnreadCount(chatItem.threadId, receiverId);
        const formData = new FormData();
        formData.append('receiver_user_id', receiverId);
        formData.append('title', 'New Message received');
        formData.append('message', 'You have new message from: ' + senderName);
        formData.append('type', 'chat');
        formData.append('modules_type', 'chat');
        formData.append('senderName', senderName);
        formData.append('sender_user_id', senderId);
        await sendNotification(formData).unwrap();
      }
    },
    [
      chatItem.threadId,
      receiverAvatar,
      receiverId,
      receiverName,
      sendNotification,
      senderAvatar,
      senderId,
      senderName,
      uInfo?.id,
    ],
  );

  const renderSendButton = useCallback((props: SendProps<IMessage>) => {
    return <SendButton {...props} />;
  }, []);

  const renderBubble = useCallback((props: BubbleProps<IMessage>) => {
    return <CustomChatBubble {...props} />;
  }, []);

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.white}
        translucent={false}
      />
      <KeyboardAvoidingView
        style={[VS.flex_1]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}>
        <View style={[VS.flex_1, CommonStyle.bgWhite]}>
          <View style={[{paddingTop: top}]}>
            <View
              style={[
                VS.ai_start,
                VS.fd_row,
                VS.ph_15,
                VS.pv_10,
                VS.pt_4,
                VS.gap_15,
              ]}>
              <TouchableOpacity hitSlop={20} activeOpacity={1} onPress={goBack}>
                <Icons.ArrowBack />
              </TouchableOpacity>
              <View style={[VS.ai_start, VS.flex_1, VS.gap_4]}>
                <Text
                  fontWeight="semiBold"
                  ellipsizeMode={'tail'}
                  style={[TS.fs_20, TS.lh_24, CommonStyle.textBlack]}>
                  {setField(receiverName)}
                </Text>
                {online ? (
                  <Text style={[TS.fs_11, CommonStyle.textPrimary]}>
                    {t('online')}
                  </Text>
                ) : lastSeen ? (
                  <Text
                    ellipsizeMode={'tail'}
                    style={[TS.fs_11, CommonStyle.textBlueGray]}>
                    {`${t('lastSeen')} ${setField(
                      moment(lastSeen).format('DD MMM, YYYY hh:mm A'),
                    )}`}
                  </Text>
                ) : null}
              </View>
            </View>
          </View>
          {loading ? (
            <View style={[VS.flex_1, VS.ai_center, VS.jc_center]}>
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          ) : (
            <View style={[VS.flex_1, {paddingBottom: bottom}]}>
              <GiftedChat
                messages={messages ?? []}
                infiniteScroll
                inverted
                keyboardShouldPersistTaps={'handled'}
                textInputProps={{
                  autoCapitalize: 'sentences',
                  autoCorrect: false,
                  multiline: true,
                  placeholder: t('typeMessage'),
                  style: {
                    height: 'auto',
                    flex: 1,
                    paddingHorizontal: 10,
                    color: Colors.black,
                  },
                  fontSize: Scale(14),
                }}
                user={{
                  _id: senderId,
                  avatar: senderAvatar,
                }}
                showAvatarForEveryMessage={true}
                isKeyboardInternallyHandled={true}
                renderAvatar={null}
                bottomOffset={bottom}
                alwaysShowSend={false}
                messagesContainerStyle={[VS.flex_1, AppStyle.flexGrow]}
                onSend={handleSend}
                renderBubble={renderBubble}
                renderSend={renderSendButton}
              />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </>
  );
}
