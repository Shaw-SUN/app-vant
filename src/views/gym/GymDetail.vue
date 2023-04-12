<template>
  <div>
    <van-card desc="地址" thumb="https://img01.yzcdn.cn/vant/ipad.jpeg" class="card">
      <template #title>
        <div class="name">名称</div>
      </template>
      <template #tags>
        <van-tag color="#e9fadd" text-color="#b8e4c9" class="tag"><van-icon name="clock-o" />12:00-1:00</van-tag>
        <van-tag color="#ebe6e6" text-color="#ff896b"><van-icon name="phone-o" />178777777</van-tag>
      </template>
      <template #num>
        <div><van-icon name="location-o" />距离2km</div>
      </template>
    </van-card>
  </div>
</template>

<script>
export default {}
</script>

<style></style>
