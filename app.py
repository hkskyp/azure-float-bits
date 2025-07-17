import streamlit as st

st.set_page_config(page_title="My Streamlit App on Azure", layout="centered")

st.title("🚀 Hello from Streamlit on Azure!")
st.write("이 앱은 Azure Web App에 배포된 Streamlit 앱입니다.")

name = st.text_input("이름을 입력하세요:")
if name:
    st.success(f"{name}님, 환영합니다!")

st.markdown("---")
st.write("이 앱은 Azure App Service를 통해 실행되고 있습니다.")
